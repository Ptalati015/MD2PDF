import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.use({ gfm: true });

export function parseMarkdown(content: string): string {
  // Normalize continuation lines in lists (e.g. \n followed by 2-3 spaces) before parsing
  // so that inline code at the start of a wrapped markdown line doesn't split across text nodes
  const normalized = content.replace(/\n {2,3}(?![ \-*+]|\d+\.)/g, ' ');
  const rawHtml = marked.parse(normalized) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['style', 'target', 'open', 'align'],
    ADD_TAGS: ['details', 'summary', 'kbd', 'mark'],
  });
}
