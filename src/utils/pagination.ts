// Standard A4 dimensions at 96 DPI
export const PAGE_W_PX = Math.round(210 * 96 / 25.4); // 794px
export const PAGE_H_PX = Math.round(297 * 96 / 25.4); // 1122px
export const PADDING_PX = 60; // ~16mm margins

export const PAGE_BOTTOM_MARGIN = 40;
export const PAGE_TOP_MARGIN = 44;

/** Collapses \n in text nodes so html2canvas doesn't drop text after a newline character.
 *  Skips <pre> to preserve code block formatting. */
export function collapseTextNodeNewlines(node: Node): void {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent) child.textContent = child.textContent.replace(/\n[ \t]*/g, ' ');
    } else if ((child as Element).nodeName !== 'PRE') {
      collapseTextNodeNewlines(child);
    }
  });
}

/** Returns an element's top offset relative to a given ancestor */
export function getOffsetTop(el: HTMLElement, container: HTMLElement): number {
  const elementRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return elementRect.top - containerRect.top + container.scrollTop;
}

/** Prepares interactive DOM elements for print & preview consistency:
 *  - Forces <details> open & ensures dropdown icon */
export function prepareDomForPaging(container: HTMLElement): void {
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
}

/** Pushes block elements that straddle a page boundary down to the next page */
export function applyAvoidPageBreaks(container: HTMLElement, inner: HTMLElement): number {
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
      const lookAhead = next ? Math.min(next.offsetHeight, 140) : 50;
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

  return Math.ceil(container.offsetHeight / PAGE_H_PX) || 1;
}