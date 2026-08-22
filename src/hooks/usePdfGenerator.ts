import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { pdfStyles } from '../utils/pdfStyles';
import {
  PAGE_W_PX,
  PAGE_H_PX,
  PADDING_PX,
  prepareDomForPaging,
  applyAvoidPageBreaks,
} from '../utils/pagination';

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
    prepareDomForPaging(container);

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

    applyAvoidPageBreaks(container, inner);

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
