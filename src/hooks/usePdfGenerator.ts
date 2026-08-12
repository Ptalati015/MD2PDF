import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { pdfStyles } from '../utils/pdfStyles';

// A4 at 96 dpi
const PAGE_W_PX = Math.round(210 * 96 / 25.4); // 794px
const PAGE_H_PX = Math.round(297 * 96 / 25.4); // 1122px
const PADDING_PX = 80;

/** Returns an element's top offset relative to a given ancestor, reading offsetTop
 *  at each level which forces synchronous reflow — making position reads accurate
 *  even immediately after sibling margins have been mutated in the same loop. */
function getOffsetTop(el: HTMLElement, container: HTMLElement): number {
  let top = 0;
  let current: HTMLElement | null = el;
  while (current && current !== container) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

// Gap preserved from the bottom of a page before pushing to the next
const PAGE_BOTTOM_MARGIN = 36;
// Headings get a much larger bottom margin so they're never stranded alone
const HEADING_BOTTOM_MARGIN = 140;
// Gap added at the top of the next page after a push
const PAGE_TOP_MARGIN = 44;

/** Pushes block elements that straddle a page boundary down to the next page. */
function avoidPageBreaks(container: HTMLElement): void {
  // ul/ol excluded — pushing a whole list double-gaps when its preceding p is also pushed
  const blocks = container.querySelectorAll<HTMLElement>(
    'p, h1, h2, h3, h4, h5, h6, pre, blockquote, table, img, li, tr'
  );

  blocks.forEach((block) => {
    // offsetTop read here forces reflow, so it reflects any margins added earlier in the loop
    const top = getOffsetTop(block, container);
    const height = block.offsetHeight;

    if (height >= PAGE_H_PX) return;

    const pageOfTop = Math.floor(top / PAGE_H_PX);
    const nextPageStart = (pageOfTop + 1) * PAGE_H_PX;

    const isHeading = /^H[1-6]$/.test(block.tagName);
    const bottomMargin = isHeading ? HEADING_BOTTOM_MARGIN : PAGE_BOTTOM_MARGIN;
    const tooCloseToBottom = (top + height) > (nextPageStart - bottomMargin);

    if (tooCloseToBottom) {
      const push = nextPageStart + PAGE_TOP_MARGIN - top;
      const currentMargin = parseFloat(window.getComputedStyle(block).marginTop) || 0;
      block.style.marginTop = `${currentMargin + push}px`;
    }
  });

  // Second pass in REVERSE DOM order so that when we check a heading, its
  // sibling paragraph has already been evaluated and potentially moved.
  Array.from(container.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, h5, h6'))
    .reverse()
    .forEach((el) => {
      const next = el.nextElementSibling as HTMLElement | null;
      if (!next) return;

      const elTop = getOffsetTop(el, container);
      const elPage = Math.floor(elTop / PAGE_H_PX);
      const nextPage = Math.floor(getOffsetTop(next, container) / PAGE_H_PX);

      if (nextPage > elPage) {
        const nextPageStart = (elPage + 1) * PAGE_H_PX;
        const push = nextPageStart + PAGE_TOP_MARGIN - elTop;
        const currentMargin = parseFloat(window.getComputedStyle(el).marginTop) || 0;
        el.style.marginTop = `${currentMargin + push}px`;
      }
    });
}

export async function generatePdf(htmlContent: string, filename: string): Promise<void> {
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'absolute',
    top: '0',
    left: '-9999px',
    width: `${PAGE_W_PX}px`,
    padding: `${PADDING_PX}px`,
    background: '#ffffff',
    color: '#1a1a1a',
  });

  const style = document.createElement('style');
  style.textContent = pdfStyles;
  container.appendChild(style);

  const inner = document.createElement('div');
  inner.innerHTML = htmlContent;
  container.appendChild(inner);

  document.body.appendChild(container);

  try {
    avoidPageBreaks(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: PAGE_W_PX,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    // One PDF page = PAGE_H_PX rendered pixels × scale
    const pageSliceH = PAGE_H_PX * 2;
    const totalPages = Math.ceil(canvas.height / pageSliceH);

    // Minimum canvas pixels a last page must have to not be treated as blank padding
    const MIN_CONTENT_PX = PADDING_PX * 2 * 2; // bottom-padding × scale, doubled for safety

    let firstPage = true;
    for (let i = 0; i < totalPages; i++) {
      const srcY = i * pageSliceH;
      const srcH = Math.min(pageSliceH, canvas.height - srcY);

      // Skip a trailing near-empty page caused by bottom padding overshooting a boundary
      if (i === totalPages - 1 && srcH < MIN_CONTENT_PX) break;

      if (!firstPage) pdf.addPage();
      firstPage = false;

      // Clip exactly one page's worth of pixels into a fresh canvas
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageSliceH;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH);
    }

    pdf.save(`${filename.replace(/\.md$/i, '')}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
