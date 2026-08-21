import React from 'react';

interface Props {
  html: string;
}

export function MarkdownPreview({ html }: Props) {
  return (
    <div className="flex flex-col h-full bg-[#111114] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Preview</span>
        </div>
        <span className="text-zinc-500">A4 Document Layout</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-950 flex justify-center">
        {html.trim() ? (
          <div
            id="preview-document"
            className="w-full max-w-[794px] bg-white text-zinc-900 p-8 sm:p-12 shadow-2xl rounded-sm min-h-full font-serif text-[15px] leading-relaxed select-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 my-auto text-center p-8">
            <span className="text-4xl mb-3">👁️</span>
            <p className="text-sm font-medium">No Markdown content yet</p>
            <p className="text-xs text-zinc-600 mt-1">Start typing in the editor or upload a .md file to see live preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
