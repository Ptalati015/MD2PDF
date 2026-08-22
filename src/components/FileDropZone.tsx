import { useState, useRef } from 'react';

interface Props {
  onFile: (content: string, filename: string) => void;
}

export function FileDropZone({ onFile }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.md')) {
      alert('Please upload a .md (Markdown) file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => onFile(e.target?.result as string, file.name);
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload Markdown file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={[
        'cursor-pointer border-2 border-dashed rounded-2xl p-16 text-center',
        'transition-all duration-200 select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-500',
        dragging
          ? 'border-blue-500 bg-blue-950/30 shadow-[0_0_40px_rgba(59,130,246,0.12)]'
          : 'border-[var(--border-strong)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-surface-strong)]/40',
      ].join(' ')}
    >
      <div className="text-5xl mb-4 pointer-events-none">📄</div>
      <p className="text-[var(--text-primary)] text-lg font-medium pointer-events-none">
        Drop your Markdown file here
      </p>
      <p className="text-[var(--text-muted)] text-sm mt-2 pointer-events-none">
        or click to browse — .md files only
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".md,text/markdown"
        className="hidden"
        onChange={handleChange}
        aria-hidden="true"
      />
    </div>
  );
}
