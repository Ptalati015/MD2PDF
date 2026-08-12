interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export function DownloadButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 px-6 rounded-xl font-semibold text-sm
        bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99]
        text-white transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2"
    >
      ⬇ Download PDF again
    </button>
  );
}
