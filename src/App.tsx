import { useState, useMemo, useEffect, useRef } from 'react';
import { FileDropZone } from './components/FileDropZone';
import { MarkdownEditor } from './components/MarkdownEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { StatusMessage, type AppStatus } from './components/StatusMessage';
import { parseMarkdown } from './hooks/useMarkdownParser';
import { generatePdf } from './hooks/usePdfGenerator';
import { sampleMarkdown } from './utils/sampleMarkdown';

type AppMode = 'studio' | 'quick-convert';
type ViewLayout = 'split' | 'editor' | 'preview';
type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'md2pdf-theme';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  });
  const [appMode, setAppMode] = useState<AppMode>('studio');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('split');
  const [markdownContent, setMarkdownContent] = useState<string>(sampleMarkdown);
  const [docName, setDocName] = useState<string>('document');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [error, setError] = useState<string>('');
  const isEmptyDocument = !markdownContent.trim();

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Synchronized scrolling between editor and preview
  const editorScrollRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const activeScrollSourceRef = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleEditorScroll = () => {
    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (!editor || !preview) return;

    if (activeScrollSourceRef.current && activeScrollSourceRef.current !== 'editor') return;
    activeScrollSourceRef.current = 'editor';

    const editorMax = editor.scrollHeight - editor.clientHeight;
    const previewMax = preview.scrollHeight - preview.clientHeight;

    if (editorMax > 0 && previewMax > 0) {
      const ratio = editor.scrollTop / editorMax;
      preview.scrollTop = ratio * previewMax;
    }

    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      activeScrollSourceRef.current = null;
    }, 100);
  };

  const handlePreviewScroll = () => {
    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (!editor || !preview) return;

    if (activeScrollSourceRef.current && activeScrollSourceRef.current !== 'preview') return;
    activeScrollSourceRef.current = 'preview';

    const editorMax = editor.scrollHeight - editor.clientHeight;
    const previewMax = preview.scrollHeight - preview.clientHeight;

    if (editorMax > 0 && previewMax > 0) {
      const ratio = preview.scrollTop / previewMax;
      editor.scrollTop = ratio * editorMax;
    }

    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      activeScrollSourceRef.current = null;
    }, 100);
  };

  // Live parsed HTML
  const parsedHtml = useMemo(() => {
    return parseMarkdown(markdownContent);
  }, [markdownContent]);

  // Document metrics
  const metrics = useMemo(() => {
    const text = markdownContent.trim();
    if (!text) return { words: 0, chars: 0, lines: 0 };
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    return { words, chars, lines };
  }, [markdownContent]);

  const handleGenerate = async () => {
    if (isEmptyDocument) {
      setStatus('error');
      setError('Cannot generate a PDF from an empty document. Add or upload Markdown content first.');
      return;
    }

    setStatus('generating');
    setError('');
    try {
      const exportName = docName.trim() || 'document';
      await generatePdf(parsedHtml, exportName);
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed');
      setStatus('error');
    }
  };

  const handleQuickConvertUpload = (content: string, name: string) => {
    setMarkdownContent(content);
    setDocName(name.replace(/\.md$/i, ''));
    setStatus('file-selected');
    setError('');
  };

  const handleStudioUpload = (content: string, name: string) => {
    setMarkdownContent(content);
    setDocName(name.replace(/\.md$/i, ''));
    setError('');
  };

  const handleStudioChange = (content: string) => {
    setMarkdownContent(content);
    if (status === 'error') {
      setStatus('idle');
      setError('');
    }
  };

  const handleLoadSample = () => {
    setMarkdownContent(sampleMarkdown);
    setDocName('system-design-spec');
    setError('');
  };

  const handleStudioClear = () => {
    setStatus('idle');
    setError('');
  };

  return (
    <div
      data-theme={theme}
      className="h-screen max-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans overflow-hidden"
    >
      {/* Top Navigation Header */}
      <header className="h-14 flex-shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="MD2PDF logo" className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
              MD2PDF
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              v2.0
            </span>
          </div>

          <div className="hidden sm:flex items-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-0.5 text-xs ml-3">
            <button
              onClick={() => setAppMode('studio')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                appMode === 'studio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Studio Editor
            </button>
            <button
              onClick={() => setAppMode('quick-convert')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                appMode === 'quick-convert'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Quick Convert
            </button>
          </div>
        </div>

        {/* Center: Filename Input in Studio Mode */}
        {appMode === 'studio' && (
          <div className="hidden md:flex items-center gap-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-1 text-xs">
            <span className="text-[var(--text-muted)]">File:</span>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="filename"
              className="bg-transparent text-[var(--text-primary)] outline-none w-36 font-mono text-xs"
            />
            <span className="text-[var(--text-muted)] font-mono">.pdf</span>
          </div>
        )}

        {/* Right: Actions & Download Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-sm"
          >
            {theme === 'dark' ? '\u{1F319}' : '\u2600\uFE0F'}
          </button>

          {appMode === 'studio' && (
            <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewLayout('editor')}
                title="Editor only"
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewLayout === 'editor' ? 'bg-[var(--bg-surface-strong)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewLayout('split')}
                title="Split View"
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewLayout === 'split' ? 'bg-[var(--bg-surface-strong)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewLayout('preview')}
                title="Preview only"
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewLayout === 'preview' ? 'bg-[var(--bg-surface-strong)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Preview
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={status === 'generating'}
            title={isEmptyDocument ? 'Add or upload Markdown content before generating a PDF' : 'Download PDF'}
            className="px-4 py-1.5 rounded-lg font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white transition-all shadow-md flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'generating' ? (
              <>
                <span className="animate-spin text-sm">⚙️</span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>⬇</span>
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main App Content Area */}
      {appMode === 'studio' ? (
        <main className="flex-1 min-h-0 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">
          {(status === 'generating' || isEmptyDocument) && (
            <div className="flex justify-center flex-shrink-0">
              {status === 'generating' ? (
                <div className="w-full max-w-4xl flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card-info-bg)] border border-[var(--card-info-border)] text-[var(--card-info-text)]">
                  <span className="text-xl animate-spin">⚙️</span>
                  <div>
                    <p className="font-medium text-sm">Generating PDF…</p>
                    <p className="text-xs text-[var(--card-info-sub)]">Rendering the current Markdown into a downloadable file.</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-4xl flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card-warn-bg)] border border-[var(--card-warn-border)] text-[var(--card-warn-text)]">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium text-sm">No content to export yet</p>
                    <p className="text-xs text-[var(--card-warn-sub)]">Add or upload Markdown, then click Download PDF.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 h-full overflow-hidden">
            {/* Left: Markdown Editor */}
            {(viewLayout === 'editor' || viewLayout === 'split') && (
              <div className={`${viewLayout === 'editor' ? 'md:col-span-2' : ''} h-full min-h-0 overflow-hidden`}>
                <MarkdownEditor
                  value={markdownContent}
                  onChange={handleStudioChange}
                  onUploadFile={handleStudioUpload}
                  onLoadSample={handleLoadSample}
                  onClear={handleStudioClear}
                  textareaRefProp={editorScrollRef}
                  onScroll={handleEditorScroll}
                />
              </div>
            )}

            {/* Right: Live Preview */}
            {(viewLayout === 'preview' || viewLayout === 'split') && (
              <div className={`${viewLayout === 'preview' ? 'md:col-span-2' : ''} h-full min-h-0 overflow-hidden`}>
                <MarkdownPreview
                  html={parsedHtml}
                  scrollRef={previewScrollRef}
                  onScroll={handlePreviewScroll}
                />
              </div>
            )}

            {status === 'error' && appMode === 'studio' && (
              <div className="md:col-span-2">
                <StatusMessage status={status} filename={docName ? `${docName}.md` : undefined} error={error} />
              </div>
            )}
          </div>
        </main>
      ) : (
        /* V1 Quick Convert Mode */
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-xl flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                Quick Convert
              </h2>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Drop your Markdown file for immediate client-side PDF export
              </p>
            </div>

            {isEmptyDocument && status === 'idle' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card-warn-bg)] border border-[var(--card-warn-border)] text-[var(--card-warn-text)]">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-medium text-sm">No document loaded</p>
                  <p className="text-xs text-[var(--card-warn-sub)]">Upload a Markdown file to enable export.</p>
                </div>
              </div>
            )}

            {status === 'idle' && <FileDropZone onFile={handleQuickConvertUpload} />}

            <StatusMessage status={status} filename={docName ? `${docName}.md` : undefined} error={error} />

            {status === 'file-selected' && (
              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--card-info-border)] bg-[var(--card-info-bg)] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-xl">✏️</div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--card-info-text)]">Edit this file in Studio</p>
                    <p className="text-xs text-[var(--card-info-sub)]">Switch to the editor to refine the Markdown before exporting.</p>
                  </div>
                </div>
                <button
                  onClick={() => setAppMode('studio')}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white transition-all shadow-lg shadow-blue-600/20"
                >
                  Open in Studio
                </button>
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-[var(--bg-surface-strong)] hover:bg-[var(--border-strong)] active:scale-[0.99] text-[var(--text-primary)] transition-all border border-[var(--border-strong)]"
                >
                  Generate PDF
                </button>
              </div>
            )}

            {status === 'generating' && (
              <button
                disabled
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-blue-600 text-white opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="animate-spin inline-block">⚙️</span>
                Generating PDF…
              </button>
            )}

            {status === 'ready' && (
              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--card-success-border)] bg-[var(--card-success-bg)] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-xl">✅</div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--card-success-text)]">PDF is ready</p>
                    <p className="text-xs text-[var(--card-success-sub)]">You can keep exporting, or open the file in Studio for more edits.</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  ⬇ Download PDF again
                </button>
                <button
                  onClick={() => setAppMode('studio')}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-[var(--bg-surface-strong)] hover:bg-[var(--border-strong)] active:scale-[0.99] text-[var(--text-primary)] transition-all border border-[var(--border-strong)]"
                >
                  Open in Studio
                </button>
              </div>
            )}

            {status !== 'idle' && (
              <button
                onClick={() => {
                  setStatus('idle');
                  setError('');
                }}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-sm transition-colors py-1"
              >
                ← Convert another file
              </button>
            )}
          </div>
        </main>
      )}

      {/* Footer Metrics & Status Bar */}
      <footer className="h-8 border-t border-[var(--border-subtle)] bg-[var(--bg-footer)] px-4 sm:px-6 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-4">
          <span>{metrics.words.toLocaleString()} words</span>
          <span>{metrics.chars.toLocaleString()} characters</span>
          <span>{metrics.lines.toLocaleString()} lines</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% In-Browser & Private
          </span>
        </div>
      </footer>
    </div>
  );
}
