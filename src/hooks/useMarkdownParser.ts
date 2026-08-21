import { marked } from 'marked';

marked.use({ gfm: true });

export function parseMarkdown(content: string): string {
  // Normalize continuation lines in lists (e.g. \n followed by 2-3 spaces) before parsing
  // so that inline code at the start of a wrapped markdown line doesn't split across text nodes
  const normalized = content.replace(/\n {2,3}(?![ \-*+]|\d+\.)/g, ' ');
  return marked.parse(normalized) as string;
}
