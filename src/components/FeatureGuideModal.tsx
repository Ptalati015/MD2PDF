import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GUIDE_STEPS = [
  {
    badge: 'Welcome to MD2PDF',
    title: 'Your All-in-One Markdown Studio',
    icon: '🚀',
    description:
      'Easily write, edit, and format Markdown with real-time live preview. Switch between full Studio Editor or instant Quick Convert modes.',
    highlights: [
      'Live synchronized side-by-side preview',
      'GitHub Flavored Markdown (GFM) support',
      'Instant client-side rendering with zero delay',
    ],
  },
  {
    badge: 'Formatting & Tools',
    title: 'Sticky Formatting Toolbar',
    icon: '🛠️',
    description:
      'The toolbar stays pinned to the top of your editor as you scroll, giving you instant access to essential text styling tools.',
    highlights: [
      'Bold, Italics, Headings, Lists & Code blocks',
      'Color Picker to apply custom text highlights',
      'Undo/Redo history, sample loader, and .md file upload',
    ],
  },
  {
    badge: 'Layout Controls',
    title: 'Customizable Editor Layouts',
    icon: '👁️',
    description:
      'Adapt your workspace to your preference using the header layout selector in Studio mode.',
    highlights: [
      'Split View: Edit and preview side-by-side with synced scrolling',
      'Editor Mode: Full-width focus for heavy writing',
      'Preview Mode: Distraction-free document review with page counts',
    ],
  },
  {
    badge: 'Export & Themes',
    title: 'Dark / Light Themes & PDF Export',
    icon: '📄',
    description:
      'Export production-ready, beautifully styled A4 PDFs with intelligent page breaks and crisp typography.',
    highlights: [
      '1-click Download PDF with custom filenames',
      'Smart page-break detection to prevent orphaned headings',
      'Seamless Dark and Light theme toggle',
    ],
  },
];

export function FeatureGuideModal({ isOpen, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStep];
  const isLastStep = currentStep === GUIDE_STEPS.length - 1;

  const handleClose = () => {
    if (dontShowAgain) {
      window.localStorage.setItem('md2pdf-guide-seen', 'true');
    }
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {step.badge}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {currentStep + 1} of {GUIDE_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-strong)] transition-colors text-sm font-semibold"
            aria-label="Close feature guide"
            title="Close guide"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-2xl">
              {step.icon}
            </div>
            <div>
              <h3 id="guide-title" className="text-lg font-bold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                {step.description}
              </p>
            </div>
          </div>

          {/* Key Feature Highlights list */}
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3.5 space-y-2">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
              Key Highlights
            </span>
            {step.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)]">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            {GUIDE_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-blue-500'
                    : 'w-2 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]'
                }`}
                title={`Go to step ${idx + 1}`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-secondary)] select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-[var(--border-strong)] bg-[var(--bg-panel)] text-blue-600 focus:ring-blue-500/30"
            />
            <span>Don't show on startup</span>
          </label>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-strong)] hover:bg-[var(--border-strong)] transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md"
            >
              {isLastStep ? 'Get Started 🚀' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
