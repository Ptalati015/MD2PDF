interface Props {
  onInsert: (before: string, after?: string, defaultText?: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  onLoadSample: () => void;
  onUploadClick: () => void;
}

export function Toolbar({
  onInsert,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onLoadSample,
  onUploadClick,
}: Props) {
  const tools = [
    { label: 'B', title: 'Bold (Ctrl+B)', before: '**', after: '**', text: 'bold text', bold: true },
    { label: 'I', title: 'Italic (Ctrl+I)', before: '*', after: '*', text: 'italic text', italic: true },
    { label: 'S', title: 'Strikethrough', before: '~~', after: '~~', text: 'strikethrough', strike: true },
    { type: 'sep' },
    { label: 'H1', title: 'Heading 1', before: '# ', after: '', text: 'Heading 1' },
    { label: 'H2', title: 'Heading 2', before: '## ', after: '', text: 'Heading 2' },
    { label: 'H3', title: 'Heading 3', before: '### ', after: '', text: 'Heading 3' },
    { type: 'sep' },
    { label: '“ ”', title: 'Quote', before: '> ', after: '', text: 'Quote' },
    { label: '` `', title: 'Inline Code', before: '`', after: '`', text: 'code' },
    { label: '{ }', title: 'Code Block', before: '```\n', after: '\n```', text: 'code block' },
    { type: 'sep' },
    { label: '• List', title: 'Bullet List', before: '- ', after: '', text: 'List item' },
    { label: '1. List', title: 'Numbered List', before: '1. ', after: '', text: 'List item' },
    { label: '☑ Task', title: 'Task List', before: '- [ ] ', after: '', text: 'Task item' },
    { type: 'sep' },
    { label: '🔗 Link', title: 'Insert Link', before: '[', after: '](https://example.com)', text: 'Link text' },
    { label: '📊 Table', title: 'Insert Table', before: '| Column 1 | Column 2 |\n|---|---|\n| Item 1 | Item 2 |\n', after: '', text: '' },
    { label: '— Divider', title: 'Horizontal Divider', before: '\n---\n\n', after: '', text: '' },
  ];

  return (
    <div className="flex items-center flex-wrap gap-1 p-2 bg-zinc-900 border-b border-zinc-800 text-xs">
      <div className="flex items-center flex-wrap gap-1">
        <button
          type="button"
          title="Undo (Ctrl+Z)"
          onClick={onUndo}
          disabled={!canUndo}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          type="button"
          title="Redo (Ctrl+Y / Shift+Ctrl+Z)"
          onClick={onRedo}
          disabled={!canRedo}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Redo
        </button>
        <div className="w-px h-5 bg-zinc-800 mx-1" />

        {tools.map((t, idx) => {
          if (t.type === 'sep') {
            return <div key={idx} className="w-px h-5 bg-zinc-800 mx-1" />;
          }
          return (
            <button
              key={idx}
              type="button"
              title={t.title}
              onClick={() => onInsert(t.before!, t.after, t.text)}
              className={[
                'px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800',
                t.bold ? 'font-bold' : '',
                t.italic ? 'italic font-serif' : '',
                t.strike ? 'line-through' : '',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onUploadClick}
          className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
          title="Upload .md file to editor"
        >
          <span>📁</span>
          <span>Upload File</span>
        </button>
        <button
          type="button"
          onClick={onLoadSample}
          className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
          title="Load sample Markdown document"
        >
          <span>✨</span>
          <span>Sample</span>
        </button>
        <button
          type="button"
          onClick={onClear}
          className="px-2.5 py-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          title="Clear editor"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
