export const sampleMarkdown = `# Document Title: System Design Spec

**Author:** Engineering Team  
**Date:** 2026-08-20  
**Status:** \`Ready for Review\`

---

## 1. Executive Summary

This specification outlines the architecture for high-throughput document processing. The system converts raw input formats into standardized, printable assets with high typographic fidelity.

## 2. Core Objectives

- **Fast Client-Side Generation**: Sub-second rendering with zero server costs.
- **Typographic Polish**: Clean serif headings, elegant margins, and consistent spacing.
- **Smart Page Breaks**: No orphaned section headers or severed list items.

## 3. Architecture Overview

\`\`\`
Client Browser ──▶ Markdown Parser ──▶ DOM Normalizer ──▶ PDF Engine ──▶ Local Download
\`\`\`

### Key Components

| Component | Responsibility | Tech |
|---|---|---|
| **Editor** | Real-time text input & toolbar shortcuts | React 19 + TypeScript |
| **Parser** | GitHub Flavored Markdown to HTML | marked |
| **Renderer** | Canvas rasterization & PDF assembly | jsPDF + html2canvas |

## 4. Key Configuration

\`\`\`json
{
  "pageSize": "A4",
  "marginMm": 20,
  "theme": "clean-serif",
  "smartBreaks": true
}
\`\`\`

> **Note:** "Simplicity is prerequisite for reliability."  
> <sub>— Edsger W. Dijkstra</sub>

## 5. Next Steps

1. Review and approve architecture.
2. Verify cross-platform document rendering.
3. Deploy application to production.
`;
