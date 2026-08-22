interface Props {
  onInsert: (before: string, after?: string, defaultText?: string) => void;
  activeColor: string;
  onChooseColor: (color: string) => void;
  onApplyColor: () => void;
  onRemoveColor: () => void;
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
  activeColor,
  onChooseColor,
  onApplyColor,
  onRemoveColor,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onLoadSample,
  onUploadClick,
}: Props) {
  const colorInputId = 'md2pdf-color-input';
  const presetColors = [
    { label: 'Red', value: '#ef4444' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Purple', value: '#a855f7' },
  ];

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
          onMouseDown={(e) => e.preventDefault()}
          disabled={!canUndo}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          type="button"
          title="Redo (Ctrl+Y / Shift+Ctrl+Z)"
          onClick={onRedo}
          onMouseDown={(e) => e.preventDefault()}
          disabled={!canRedo}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Redo
        </button>
        <div className="w-px h-5 bg-zinc-800 mx-1" />

        <button
          type="button"
          title={`Choose text color (current ${activeColor})`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => document.getElementById(colorInputId)?.click()}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
        >
          <span className="inline-block w-3.5 h-3.5 rounded border border-zinc-500" style={{ backgroundColor: activeColor }} />
          <span>Pick</span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{activeColor}</span>
        </button>
        <button
          type="button"
          title={`Apply ${activeColor} to selected text`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onApplyColor}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          Apply {activeColor}
        </button>
        <input
          id={colorInputId}
          type="color"
          value={activeColor}
          onChange={(e) => onChooseColor(e.target.value)}
          className="sr-only"
          aria-label="Choose text color"
        />
        {presetColors.map((color) => (
          <button
            key={color.value}
            type="button"
            title={`Choose ${color.label} color`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChooseColor(color.value)}
            className={[
              'w-7 h-7 rounded-md border transition-all hover:border-zinc-400 hover:scale-105',
              activeColor.toLowerCase() === color.value ? 'border-white ring-2 ring-white/30' : 'border-zinc-700',
            ].join(' ')}
            style={{ backgroundColor: color.value }}
            aria-label={`Choose ${color.label} color`}
          />
        ))}
        <button
          type="button"
          title="Remove color"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onRemoveColor}
          className="px-2.5 py-1.5 rounded-md font-medium transition-colors text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          No Color
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
              onMouseDown={(e) => e.preventDefault()}
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
