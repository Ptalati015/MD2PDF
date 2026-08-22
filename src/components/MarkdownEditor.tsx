import React, { useRef, useState } from 'react';
import { Toolbar } from './Toolbar';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onUploadFile: (content: string, filename: string) => void;
  onLoadSample: () => void;
  onClear?: () => void;
}

export function MarkdownEditor({ value, onChange, onUploadFile, onLoadSample, onClear }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeColor, setActiveColor] = useState('#ef4444');
  const historyRef = useRef<{ value: string; start: number; end: number }[]>([
    { value, start: 0, end: 0 },
  ]);
  const historyIndexRef = useRef(0);
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);

  const applySelection = () => {
    const textarea = textareaRef.current;
    const pending = pendingSelectionRef.current;
    if (!textarea || !pending) return;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(pending.start, pending.end);
      pendingSelectionRef.current = null;
    });
  };

  const pushHistory = (nextValue: string, start: number, end: number) => {
    const entries = historyRef.current;
    const index = historyIndexRef.current;
    const current = entries[index];

    if (current && current.value === nextValue) {
      current.start = start;
      current.end = end;
      return;
    }

    const trimmed = entries.slice(0, index + 1);
    trimmed.push({ value: nextValue, start, end });

    // Keep history bounded to avoid unbounded memory growth.
    if (trimmed.length > 500) trimmed.shift();

    historyRef.current = trimmed;
    historyIndexRef.current = trimmed.length - 1;
  };

  const applyValueWithHistory = (nextValue: string, start: number, end: number) => {
    pushHistory(nextValue, start, end);
    pendingSelectionRef.current = { start, end };
    onChange(nextValue);
    applySelection();
  };

  const findColorSpan = (selectionStart: number, selectionEnd: number) => {
    const regex = /<span\s+style="color:([^"]+)">([\s\S]*?)<\/span>/gi;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(value))) {
      const spanStart = match.index;
      const spanText = match[0];
      const spanEnd = spanStart + spanText.length;
      const innerStart = spanStart + spanText.indexOf(match[2]);
      const innerEnd = innerStart + match[2].length;

      if (selectionStart >= innerStart && selectionEnd <= innerEnd) {
        return {
          spanStart,
          spanEnd,
          innerStart,
          innerEnd,
          innerText: match[2],
          color: match[1],
        };
      }
    }

    return null;
  };

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const entry = historyRef.current[historyIndexRef.current];
    pendingSelectionRef.current = { start: entry.start, end: entry.end };
    onChange(entry.value);
    applySelection();
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const entry = historyRef.current[historyIndexRef.current];
    pendingSelectionRef.current = { start: entry.start, end: entry.end };
    onChange(entry.value);
    applySelection();
  };

  const handleInsert = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const textToWrap = selected || defaultText;

    const replacement = `${before}${textToWrap}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    const selectionStart = start + before.length;
    const selectionEnd = selected
      ? start + before.length + selected.length
      : start + before.length + defaultText.length;

    applyValueWithHistory(newValue, selectionStart, selectionEnd);
  };

  const handleInsertColor = (color: string) => {
    setActiveColor(color);
  };

  const applySelectedColor = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const enclosingSpan = findColorSpan(start, end);
    const textToWrap = selected || 'colored text';
    const color = activeColor;

    const before = `<span style="color:${color}">`;
    const after = '</span>';

    if (enclosingSpan && selected === enclosingSpan.innerText) {
      const newValue =
        value.substring(0, enclosingSpan.spanStart) + before + enclosingSpan.innerText + after + value.substring(enclosingSpan.spanEnd);
      const selectionStart = enclosingSpan.spanStart + before.length;
      const selectionEnd = selectionStart + enclosingSpan.innerText.length;
      applyValueWithHistory(newValue, selectionStart, selectionEnd);
      return;
    }

    const newValue = value.substring(0, start) + before + textToWrap + after + value.substring(end);
    const selectionStart = start + before.length;
    const selectionEnd = selectionStart + textToWrap.length;

    applyValueWithHistory(newValue, selectionStart, selectionEnd);
  };

  const handleRemoveColor = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const enclosingSpan = findColorSpan(start, end);

    if (!enclosingSpan) return;

    const newValue =
      value.substring(0, enclosingSpan.spanStart) + enclosingSpan.innerText + value.substring(enclosingSpan.spanEnd);
    const selectionStart = enclosingSpan.spanStart;
    const selectionEnd = selectionStart + enclosingSpan.innerText.length;

    applyValueWithHistory(newValue, selectionStart, selectionEnd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Tab / Shift+Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Outdent
        const before = value.substring(0, start);
        const lastNewline = before.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        if (value.substring(lineStart, lineStart + 2) === '  ') {
          const updated = value.substring(0, lineStart) + value.substring(lineStart + 2);
          const nextStart = Math.max(lineStart, start - 2);
          const nextEnd = Math.max(lineStart, end - 2);
          applyValueWithHistory(updated, nextStart, nextEnd);
        }
      } else {
        // Indent 2 spaces
        const updated = value.substring(0, start) + '  ' + value.substring(end);
        applyValueWithHistory(updated, start + 2, start + 2);
      }
      return;
    }

    // Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();

      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (key === 'b') {
        e.preventDefault();
        handleInsert('**', '**', 'bold text');
      } else if (key === 'i') {
        e.preventDefault();
        handleInsert('*', '*', 'italic text');
      } else if (key === 'k') {
        e.preventDefault();
        handleInsert('[', '](https://example.com)', 'link text');
      } else if (key === 'e') {
        e.preventDefault();
        handleInsert('`', '`', 'code');
      }
    }
  };

  const handleTextChange = (nextValue: string, start: number, end: number) => {
    pushHistory(nextValue, start, end);
    onChange(nextValue);
  };

  const handleClear = () => {
    applyValueWithHistory('', 0, 0);
    onClear?.();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.md')) {
        alert('Please drop a .md (Markdown) file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUploadFile(ev.target?.result as string, file.name);
      };
      reader.readAsText(file, 'utf-8');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUploadFile(ev.target?.result as string, file.name);
      };
      reader.readAsText(file, 'utf-8');
      e.target.value = '';
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-2xl"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Toolbar
        onInsert={handleInsert}
        activeColor={activeColor}
        onChooseColor={handleInsertColor}
        onApplyColor={applySelectedColor}
        onRemoveColor={handleRemoveColor}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndexRef.current > 0}
        canRedo={historyIndexRef.current < historyRef.current.length - 1}
        onClear={handleClear}
        onLoadSample={onLoadSample}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <div className="relative flex-1 flex">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) =>
            handleTextChange(e.target.value, e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
          }
          onKeyDown={handleKeyDown}
          placeholder="# Type or paste Markdown here, or drop a .md file..."
          spellCheck={false}
          wrap="soft"
          className="w-full h-full p-4 bg-transparent text-[var(--text-primary)] font-mono text-sm leading-relaxed resize-none outline-none focus:ring-1 focus:ring-blue-500/30 selection:bg-blue-600/30"
          style={{ overflow: 'hidden', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,text/markdown"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
}
