import { useRef, useLayoutEffect, useState } from 'react';
import {
  PAGE_W_PX,
  PAGE_H_PX,
  PADDING_PX,
  prepareDomForPaging,
  applyAvoidPageBreaks,
  collapseTextNodeNewlines,
} from '../utils/pagination';
import { pdfStyles } from '../utils/pdfStyles';

interface Props {
  html: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export function MarkdownPreview({ html, scrollRef, onScroll }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current || !innerRef.current || !html.trim()) {
      setPageCount(1);
      setPageBreaks((current) => (current.length === 0 ? current : []));
      return;
    }

    const container = containerRef.current;
    const inner = innerRef.current;

    // Reset element inline top margins before re-measuring
    inner.querySelectorAll<HTMLElement>('*').forEach((el) => {
      if (el.style.marginTop) el.style.marginTop = '';
    });

    // 1. Ensure text node line wrapping matches PDF engine
    collapseTextNodeNewlines(inner);

    // 2. Prepare interactive DOM elements
    prepareDomForPaging(container);

    // 3. Apply shared smart page break algorithm
    const totalPages = applyAvoidPageBreaks(container, inner);
    setPageCount((current) => (current === totalPages ? current : totalPages));

    // 4. Generate page boundary pixel marks (PAGE_H_PX * 1, PAGE_H_PX * 2, etc.)
    const breaks: number[] = [];
    for (let i = 1; i < totalPages; i++) {
      breaks.push(i * PAGE_H_PX);
    }
    setPageBreaks((current) => {
      const unchanged = current.length === breaks.length && current.every((value, index) => value === breaks[index]);
      return unchanged ? current : breaks;
    });
  });

  return (
    <div className="flex flex-col h-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex-shrink-0 bg-[var(--bg-panel)] rounded-t-xl border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] font-medium select-none rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Document Preview</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-strong)] text-[var(--text-secondary)] font-mono border border-[var(--border-strong)]">
              {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} (A4)
            </span>
          </div>
        </div>

        <div className="px-4 py-1.5 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] text-[11px] text-amber-600">
          Page break indicators are heuristic and may not always match the final PDF exactly. Most documents render cleanly, but complex Markdown can still vary slightly.
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 bg-[var(--bg-app)] flex justify-center"
      >
        {html.trim() ? (
          <div className="relative">
            {/* The main A4 rendered page canvas */}
            <div
              ref={containerRef}
              id="preview-document"
              style={{
                width: `${PAGE_W_PX}px`,
                padding: `${PADDING_PX}px`,
                minHeight: `${PAGE_H_PX}px`,
              }}
              className="bg-white text-zinc-900 shadow-2xl rounded-sm font-serif text-[15px] leading-relaxed select-text relative"
            >
              <style>{pdfStyles}</style>
              <div ref={innerRef} dangerouslySetInnerHTML={{ __html: html }} />

              {/* Visual Page Break Guidelines in Preview */}
              {pageBreaks.map((breakY, idx) => (
                <div
                  key={idx}
                  style={{ top: `${breakY}px` }}
                  className="absolute left-0 right-0 pointer-events-none flex items-center justify-center -translate-y-1/2 z-10"
                >
                  <div className="w-full border-b-2 border-dashed border-blue-400/60" />
                  <span className="absolute px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full shadow-md border border-blue-400/50">
                    Page {idx + 2} Start
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-[var(--text-faint)] my-auto text-center p-8">
            <span className="text-4xl mb-3">👁️</span>
            <p className="text-sm font-medium">No Markdown content yet</p>
            <p className="text-xs text-[var(--text-faint)] mt-1">
              Start typing in the editor or upload a .md file to see live preview
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
