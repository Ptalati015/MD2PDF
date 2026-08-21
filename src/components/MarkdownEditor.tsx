import React, { useRef, useEffect } from 'react';
import { Toolbar } from './Toolbar';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onUploadFile: (content: string, filename: string) => void;
  onLoadSample: () => void;
}

export function MarkdownEditor({ value, onChange, onUploadFile, onLoadSample }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsert = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const textToWrap = selected || defaultText;

    const replacement = `${before}${textToWrap}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      if (selected) {
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + defaultText.length);
      }
    }, 0);
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
          onChange(updated);
          setTimeout(() => {
            textarea.setSelectionRange(Math.max(lineStart, start - 2), Math.max(lineStart, end - 2));
          }, 0);
        }
      } else {
        // Indent 2 spaces
        const updated = value.substring(0, start) + '  ' + value.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
      return;
    }

    // Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleInsert('**', '**', 'bold text');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleInsert('*', '*', 'italic text');
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleInsert('[', '](https://example.com)', 'link text');
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleInsert('`', '`', 'code');
      }
    }
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
      className="flex flex-col h-full bg-[#111114] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Toolbar
        onInsert={handleInsert}
        onClear={() => onChange('')}
        onLoadSample={onLoadSample}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <div className="relative flex-1 flex">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="# Type or paste Markdown here, or drop a .md file..."
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-zinc-100 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-1 focus:ring-blue-500/30 selection:bg-blue-600/30"
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
