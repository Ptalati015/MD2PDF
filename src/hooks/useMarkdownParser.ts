import { marked } from 'marked';

marked.use({ gfm: true });

export function parseMarkdown(content: string): string {
  return marked.parse(content) as string;
}
