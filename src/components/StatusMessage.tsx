export type AppStatus = 'idle' | 'file-selected' | 'generating' | 'ready' | 'error';

interface Props {
  status: AppStatus;
  filename?: string;
  error?: string;
}

const configs: Record<Exclude<AppStatus, 'idle'>, {
  icon: string;
  label: string;
  sub: (filename?: string, error?: string) => string;
  color: string;
  border: string;
}> = {
  'file-selected': {
    icon: '📎',
    label: 'File loaded',
    sub: (f) => f ?? '',
    color: 'text-zinc-300',
    border: 'border-zinc-800',
  },
  generating: {
    icon: '⚙️',
    label: 'Generating PDF…',
    sub: () => 'This may take a moment',
    color: 'text-blue-300',
    border: 'border-blue-900',
  },
  ready: {
    icon: '✅',
    label: 'PDF generated',
    sub: () => 'Your download has started',
    color: 'text-emerald-300',
    border: 'border-emerald-900',
  },
  error: {
    icon: '⚠️',
    label: 'Something went wrong',
    sub: (_f, err) => err ?? 'Please try again',
    color: 'text-red-300',
    border: 'border-red-900',
  },
};

export function StatusMessage({ status, filename, error }: Props) {
  if (status === 'idle') return null;
  const cfg = configs[status];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border ${cfg.border} ${cfg.color}`}>
      <span className="text-xl shrink-0">{cfg.icon}</span>
      <div className="min-w-0">
        <p className="font-medium text-sm">{cfg.label}</p>
        <p className="text-xs text-zinc-500 truncate">{cfg.sub(filename, error)}</p>
      </div>
    </div>
  );
}
