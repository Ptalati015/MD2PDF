import { useState } from 'react';
import { FileDropZone } from './components/FileDropZone';
import { StatusMessage, type AppStatus } from './components/StatusMessage';
import { DownloadButton } from './components/DownloadButton';
import { parseMarkdown } from './hooks/useMarkdownParser';
import { generatePdf } from './hooks/usePdfGenerator';

export default function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [filename, setFilename] = useState('');
  const [parsedHtml, setParsedHtml] = useState('');
  const [error, setError] = useState('');

  const handleFile = (content: string, name: string) => {
    setParsedHtml(parseMarkdown(content));
    setFilename(name);
    setStatus('file-selected');
    setError('');
  };

  const handleGenerate = async () => {
    setStatus('generating');
    try {
      await generatePdf(parsedHtml, filename);
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFilename('');
    setParsedHtml('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl flex flex-col gap-5">

        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            MD2PDF
          </h1>
          <p className="text-zinc-600 text-sm mt-2">
            Convert Markdown to PDF — free, private, in‑browser
          </p>
        </header>

        {status === 'idle' && <FileDropZone onFile={handleFile} />}

        <StatusMessage status={status} filename={filename} error={error} />

        {status === 'file-selected' && (
          <button
            onClick={handleGenerate}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm
              bg-blue-600 hover:bg-blue-500 active:scale-[0.99]
              text-white transition-all duration-150"
          >
            Generate PDF
          </button>
        )}

        {status === 'generating' && (
          <button
            disabled
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm
              bg-blue-600 text-white opacity-60 cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            <span className="animate-spin inline-block">⚙️</span>
            Generating…
          </button>
        )}

        {status === 'ready' && (
          <DownloadButton onClick={handleGenerate} />
        )}

        {status === 'error' && (
          <button
            onClick={handleGenerate}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm
              bg-zinc-700 hover:bg-zinc-600 active:scale-[0.99]
              text-white transition-all duration-150"
          >
            Try again
          </button>
        )}

        {status !== 'idle' && (
          <button
            onClick={handleReset}
            className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors py-1"
          >
            ← Convert another file
          </button>
        )}

      </div>
    </div>
  );
}
