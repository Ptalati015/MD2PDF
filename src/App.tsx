import { useState, useMemo } from 'react';
import { FileDropZone } from './components/FileDropZone';
import { MarkdownEditor } from './components/MarkdownEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { StatusMessage, type AppStatus } from './components/StatusMessage';
import { parseMarkdown } from './hooks/useMarkdownParser';
import { generatePdf } from './hooks/usePdfGenerator';
import { sampleMarkdown } from './utils/sampleMarkdown';

type AppMode = 'studio' | 'quick-convert';
type ViewLayout = 'split' | 'editor' | 'preview';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('studio');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('split');
  const [markdownContent, setMarkdownContent] = useState<string>(sampleMarkdown);
  const [docName, setDocName] = useState<string>('document');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [error, setError] = useState<string>('');

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
    if (!markdownContent.trim()) {
      alert('Please enter or load some Markdown content first.');
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

  const handleLoadSample = () => {
    setMarkdownContent(sampleMarkdown);
    setDocName('system-design-spec');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="h-14 border-b border-zinc-800 bg-[#0d0d10]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              MD2PDF
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              v2.0
            </span>
          </div>

          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs ml-3">
            <button
              onClick={() => setAppMode('studio')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                appMode === 'studio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Studio Editor
            </button>
            <button
              onClick={() => setAppMode('quick-convert')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                appMode === 'quick-convert'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Quick Convert
            </button>
          </div>
        </div>

        {/* Center: Filename Input in Studio Mode */}
        {appMode === 'studio' && (
          <div className="hidden md:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1 text-xs">
            <span className="text-zinc-500">File:</span>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="filename"
              className="bg-transparent text-zinc-200 outline-none w-36 font-mono text-xs focus:text-white"
            />
            <span className="text-zinc-500 font-mono">.pdf</span>
          </div>
        )}

        {/* Right: Actions & Download Button */}
        <div className="flex items-center gap-2.5">
          {appMode === 'studio' && (
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewLayout('editor')}
                title="Editor only"
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewLayout === 'editor' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewLayout('split')}
                title="Split View"
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewLayout === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewLayout('preview')}
                title="Preview only"
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewLayout === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Preview
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={status === 'generating'}
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
        <main className="flex-1 p-3 sm:p-4 flex flex-col gap-3 min-h-0 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[calc(100vh-100px)]">
            {/* Left: Markdown Editor */}
            {(viewLayout === 'editor' || viewLayout === 'split') && (
              <div className={`${viewLayout === 'editor' ? 'md:col-span-2' : ''} h-full min-h-[500px]`}>
                <MarkdownEditor
                  value={markdownContent}
                  onChange={setMarkdownContent}
                  onUploadFile={handleStudioUpload}
                  onLoadSample={handleLoadSample}
                />
              </div>
            )}

            {/* Right: Live Preview */}
            {(viewLayout === 'preview' || viewLayout === 'split') && (
              <div className={`${viewLayout === 'preview' ? 'md:col-span-2' : ''} h-full min-h-[500px]`}>
                <MarkdownPreview html={parsedHtml} />
              </div>
            )}
          </div>
        </main>
      ) : (
        /* V1 Quick Convert Mode */
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-xl flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Quick Convert
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Drop your Markdown file for immediate client-side PDF export
              </p>
            </div>

            {status === 'idle' && <FileDropZone onFile={handleQuickConvertUpload} />}

            <StatusMessage status={status} filename={docName ? `${docName}.md` : undefined} error={error} />

            {status === 'file-selected' && (
              <button
                onClick={handleGenerate}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white transition-all shadow-lg shadow-blue-600/20"
              >
                Generate PDF
              </button>
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
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  ⬇ Download PDF again
                </button>
                <button
                  onClick={() => setAppMode('studio')}
                  className="text-xs text-blue-400 hover:underline text-center py-1"
                >
                  Edit this file in Studio →
                </button>
              </div>
            )}

            {status !== 'idle' && (
              <button
                onClick={() => {
                  setStatus('idle');
                  setError('');
                }}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors py-1"
              >
                ← Convert another file
              </button>
            )}
          </div>
        </main>
      )}

      {/* Footer Metrics & Status Bar */}
      <footer className="h-8 border-t border-zinc-800 bg-[#0c0c0e] px-4 sm:px-6 flex items-center justify-between text-[11px] text-zinc-500">
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
