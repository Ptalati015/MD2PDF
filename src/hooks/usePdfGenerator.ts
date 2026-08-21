import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { pdfStyles } from '../utils/pdfStyles';

// A4 at 96 dpi
const PAGE_W_PX = Math.round(210 * 96 / 25.4); // 794px
const PAGE_H_PX = Math.round(297 * 96 / 25.4); // 1122px
const PADDING_PX = 80;

/** Collapses \n in text nodes so html2canvas doesn't drop text after a newline character.
 *  Skips <pre> to preserve code block formatting. */
function collapseTextNodeNewlines(node: Node): void {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent) child.textContent = child.textContent.replace(/\n[ \t]*/g, ' ');
    } else if ((child as Element).nodeName !== 'PRE') {
      collapseTextNodeNewlines(child);
    }
  });
}

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
const PAGE_BOTTOM_MARGIN = 40;
// Gap added at the top of the next page after a push
const PAGE_TOP_MARGIN = 44;

/** Pushes block elements that straddle a page boundary down to the next page.
 *  Iterates top-level child blocks in document order with look-ahead on headings
 *  so headings never get separated from their following content, avoiding cascading
 *  double-margin bugs. */
function avoidPageBreaks(container: HTMLElement, inner: HTMLElement): void {
  const children = Array.from(inner.children) as HTMLElement[];

  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    const top = getOffsetTop(el, container);
    const height = el.offsetHeight;

    if (height >= PAGE_H_PX) {
      // For very tall lists spanning multiple pages, break at individual items
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        const lis = Array.from(el.children) as HTMLElement[];
        for (const li of lis) {
          const liTop = getOffsetTop(li, container);
          const liHeight = li.offsetHeight;
          if (liHeight >= PAGE_H_PX) continue;
          const liPage = Math.floor(liTop / PAGE_H_PX);
          const nextStart = (liPage + 1) * PAGE_H_PX;
          if (liTop + liHeight > nextStart - PAGE_BOTTOM_MARGIN) {
            const push = nextStart + PAGE_TOP_MARGIN - liTop;
            const cur = parseFloat(window.getComputedStyle(li).marginTop) || 0;
            li.style.marginTop = `${cur + push}px`;
          }
        }
      }
      continue;
    }

    const pageOfTop = Math.floor(top / PAGE_H_PX);
    const nextPageStart = (pageOfTop + 1) * PAGE_H_PX;

    // Headings look ahead to ensure heading + first chunk of following content stay together
    if (/^H[1-6]$/.test(el.tagName)) {
      const next = el.nextElementSibling as HTMLElement | null;
      const lookAhead = next ? Math.min(next.offsetHeight, 160) : 60;
      const neededHeight = height + lookAhead;

      if (top + neededHeight > nextPageStart - PAGE_BOTTOM_MARGIN) {
        const push = nextPageStart + PAGE_TOP_MARGIN - top;
        const cur = parseFloat(window.getComputedStyle(el).marginTop) || 0;
        el.style.marginTop = `${cur + push}px`;
      }
    } else {
      if (top + height > nextPageStart - PAGE_BOTTOM_MARGIN) {
        const push = nextPageStart + PAGE_TOP_MARGIN - top;
        const cur = parseFloat(window.getComputedStyle(el).marginTop) || 0;
        el.style.marginTop = `${cur + push}px`;
      }
    }
  }
}

export async function generatePdf(htmlContent: string, filename: string): Promise<void> {
  const container = document.createElement('div');
  container.id = 'pdf-render-root';
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
  // Must run on the live DOM — innerHTML serialisation would re-introduce \n if done at parse time
  collapseTextNodeNewlines(inner);
  container.appendChild(inner);

  document.body.appendChild(container);

  try {
    // PDFs cannot be interactive — force all collapsible sections open & show expand icon
    container.querySelectorAll('details').forEach((d) => {
      d.setAttribute('open', '');
      const summary = d.querySelector('summary');
      if (summary && !summary.querySelector('.summary-icon')) {
        const icon = document.createElement('span');
        icon.className = 'summary-icon';
        icon.textContent = '▼ ';
        icon.style.display = 'inline-block';
        icon.style.marginRight = '6px';
        icon.style.fontSize = '0.75em';
        icon.style.verticalAlign = 'middle';
        summary.insertBefore(icon, summary.firstChild);
      }
    });

    // Inject explicit list markers into DOM to avoid html2canvas native marker bugs
    container.querySelectorAll('ol').forEach((ol) => {
      let idx = 1;
      const start = ol.getAttribute('start');
      if (start) idx = parseInt(start, 10) || 1;
      ol.querySelectorAll<HTMLElement>(':scope > li').forEach((li) => {
        const marker = document.createElement('span');
        marker.className = 'pdf-marker';
        marker.textContent = `${idx}.`;
        li.insertBefore(marker, li.firstChild);
        idx++;
      });
    });

    container.querySelectorAll('ul').forEach((ul) => {
      ul.querySelectorAll<HTMLElement>(':scope > li').forEach((li) => {
        const bullet = document.createElement('span');
        bullet.className = 'pdf-bullet';
        bullet.textContent = '•';
        li.insertBefore(bullet, li.firstChild);
      });
    });

    // Wait for any external images to load so dimensions are accurate during pagination and capture
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );
    }

    avoidPageBreaks(container, inner);

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
