/* Unified document typography and styling for both Live Preview and PDF Render */
export const unifiedDocumentStyles = `
  #preview-document,
  #pdf-render-root,
  .md2pdf-document {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 15px;
    line-height: 1.7;
    color: #111111;
    background-color: #ffffff;
    box-sizing: border-box;
    text-align: left;
    -webkit-font-smoothing: antialiased;
  }

  #preview-document *,
  #preview-document *::before,
  #preview-document *::after,
  #pdf-render-root *,
  #pdf-render-root *::before,
  #pdf-render-root *::after,
  .md2pdf-document *,
  .md2pdf-document *::before,
  .md2pdf-document *::after {
    box-sizing: border-box;
  }

  #preview-document h1, #pdf-render-root h1, .md2pdf-document h1,
  #preview-document h2, #pdf-render-root h2, .md2pdf-document h2,
  #preview-document h3, #pdf-render-root h3, .md2pdf-document h3,
  #preview-document h4, #pdf-render-root h4, .md2pdf-document h4,
  #preview-document h5, #pdf-render-root h5, .md2pdf-document h5,
  #preview-document h6, #pdf-render-root h6, .md2pdf-document h6 {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    line-height: 1.25;
    color: #000000;
    margin-top: 1.6em;
    margin-bottom: 0.5em;
  }

  #preview-document h1, #pdf-render-root h1, .md2pdf-document h1 { font-size: 1.9em; margin-top: 0; }
  #preview-document h2, #pdf-render-root h2, .md2pdf-document h2 { font-size: 1.3em; }
  #preview-document h3, #pdf-render-root h3, .md2pdf-document h3 { font-size: 1.1em; }
  #preview-document h4, #pdf-render-root h4, .md2pdf-document h4 { font-size: 1em; }

  #preview-document p, #pdf-render-root p, .md2pdf-document p {
    margin: 0 0 1em 0;
  }

  #preview-document a, #pdf-render-root a, .md2pdf-document a {
    color: #111111;
    text-decoration: underline;
  }

  #preview-document strong, #pdf-render-root strong, .md2pdf-document strong {
    font-weight: 700;
  }

  #preview-document em, #pdf-render-root em, .md2pdf-document em {
    font-style: italic;
  }

  #preview-document code, #pdf-render-root code, .md2pdf-document code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85em;
    background-color: #f4f4f4;
    padding: 0.1em 0.35em;
    border-radius: 3px;
    white-space: nowrap;
  }

  #preview-document pre, #pdf-render-root pre, .md2pdf-document pre {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1em 1.25em;
    margin: 0 0 1em 0;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  #preview-document pre code, #pdf-render-root pre code, .md2pdf-document pre code {
    background: none;
    padding: 0;
    font-size: 0.85em;
    white-space: pre-wrap;
  }

  #preview-document blockquote, #pdf-render-root blockquote, .md2pdf-document blockquote {
    border-left: 3px solid #cbd5e1;
    padding: 0.6em 1.2em;
    margin: 1em 0 1.5em 0;
    color: #334155;
    font-style: italic;
    background-color: #f8fafc;
    border-radius: 0 4px 4px 0;
  }

  #preview-document blockquote p, #pdf-render-root blockquote p, .md2pdf-document blockquote p {
    margin: 0 0 0.5em 0;
  }

  #preview-document blockquote sub, #pdf-render-root blockquote sub, .md2pdf-document blockquote sub,
  #preview-document blockquote cite, #pdf-render-root blockquote cite, .md2pdf-document blockquote cite,
  #preview-document blockquote small, #pdf-render-root blockquote small, .md2pdf-document blockquote small {
    display: block;
    font-style: normal;
    color: #64748b;
    font-size: 0.85em;
    margin-top: 0.5em;
    line-height: 1.4;
    position: static;
  }

  /* Robust CSS-driven Lists with guaranteed numbering and bullets */
  #preview-document ol, #pdf-render-root ol, .md2pdf-document ol {
    margin: 0 0 1em 0;
    padding-left: 2.2em;
    list-style: none;
    counter-reset: md-ol-counter;
  }

  #preview-document ol > li, #pdf-render-root ol > li, .md2pdf-document ol > li {
    counter-increment: md-ol-counter;
    margin-bottom: 0.35em;
    position: relative;
  }

  #preview-document ol > li::before, #pdf-render-root ol > li::before, .md2pdf-document ol > li::before {
    content: counter(md-ol-counter) ".";
    position: absolute;
    left: -2.2em;
    width: 1.8em;
    text-align: right;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  #preview-document ul, #pdf-render-root ul, .md2pdf-document ul {
    margin: 0 0 1em 0;
    padding-left: 1.8em;
    list-style: none;
  }

  #preview-document ul > li, #pdf-render-root ul > li, .md2pdf-document ul > li {
    margin-bottom: 0.35em;
    position: relative;
  }

  #preview-document ul > li::before, #pdf-render-root ul > li::before, .md2pdf-document ul > li::before {
    content: "•";
    position: absolute;
    left: -1.3em;
    font-family: inherit;
    font-size: 1.1em;
    line-height: inherit;
    color: inherit;
  }

  #preview-document li p, #pdf-render-root li p, .md2pdf-document li p {
    margin: 0 0 0.35em 0;
  }
  #preview-document li p:last-child, #pdf-render-root li p:last-child, .md2pdf-document li p:last-child {
    margin-bottom: 0;
  }

  #preview-document details, #pdf-render-root details, .md2pdf-document details {
    display: block;
    margin: 1em 0 1.5em 0;
    padding: 14px 18px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }

  #preview-document summary, #pdf-render-root summary, .md2pdf-document summary {
    display: block;
    list-style: none;
    font-weight: 700;
    font-size: 0.95em;
    color: #1e293b;
    margin-bottom: 0.75em;
    cursor: default;
  }

  #preview-document summary::-webkit-details-marker,
  #pdf-render-root summary::-webkit-details-marker,
  .md2pdf-document summary::-webkit-details-marker {
    display: none;
  }

  #preview-document kbd, #pdf-render-root kbd, .md2pdf-document kbd {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 0.8em;
    background-color: #f4f4f5;
    color: #18181b;
    padding: 0.15em 0.45em;
    border: 1px solid #d4d4d8;
    border-bottom: 2px solid #a1a1aa;
    border-radius: 4px;
    display: inline-block;
    line-height: 1.2;
    box-shadow: 0 1px 1px rgba(0,0,0,0.06);
  }

  #preview-document dl, #pdf-render-root dl, .md2pdf-document dl { margin: 0 0 1.25em 0; }
  #preview-document dt, #pdf-render-root dt, .md2pdf-document dt { font-weight: 700; margin-top: 0.75em; color: #111111; }
  #preview-document dd, #pdf-render-root dd, .md2pdf-document dd { margin: 0.2em 0 0.6em 1.5em; color: #333333; }

  #preview-document mark, #pdf-render-root mark, .md2pdf-document mark {
    background-color: #fef08a;
    color: inherit;
    padding: 0.1em 0.25em;
    border-radius: 2px;
  }

  #preview-document small, #pdf-render-root small, .md2pdf-document small {
    font-size: 0.85em;
    color: #555555;
  }

  #preview-document sub, #pdf-render-root sub, .md2pdf-document sub,
  #preview-document sup, #pdf-render-root sup, .md2pdf-document sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  #preview-document sup, #pdf-render-root sup, .md2pdf-document sup { top: -0.5em; }
  #preview-document sub, #pdf-render-root sub, .md2pdf-document sub { bottom: -0.25em; }

  #preview-document div[align="center"], #pdf-render-root div[align="center"], .md2pdf-document div[align="center"],
  #preview-document p[align="center"], #pdf-render-root p[align="center"], .md2pdf-document p[align="center"] {
    text-align: center;
  }

  #preview-document table, #pdf-render-root table, .md2pdf-document table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5em;
  }

  #preview-document th, #pdf-render-root th, .md2pdf-document th {
    font-weight: 700;
    text-align: left;
    padding: 0.6em 0.75em;
    border-bottom: 2px solid #222222;
    font-size: 0.95em;
  }

  #preview-document td, #pdf-render-root td, .md2pdf-document td {
    padding: 0.65em 0.75em;
    border-bottom: 1px solid #cccccc;
    vertical-align: top;
  }

  #preview-document tr:last-child td, #pdf-render-root tr:last-child td, .md2pdf-document tr:last-child td {
    border-bottom: none;
  }

  #preview-document img, #pdf-render-root img, .md2pdf-document img {
    max-width: 100%;
    height: auto;
    display: inline-block;
    vertical-align: middle;
  }

  #preview-document p img, #pdf-render-root p img, .md2pdf-document p img {
    margin-right: 6px;
    margin-bottom: 4px;
  }

  #preview-document hr, #pdf-render-root hr, .md2pdf-document hr {
    border: none;
    border-top: 1px solid #cccccc;
    margin: 1.5em 0;
  }

  #preview-document hr + h1, #pdf-render-root hr + h1, .md2pdf-document hr + h1,
  #preview-document hr + h2, #pdf-render-root hr + h2, .md2pdf-document hr + h2,
  #preview-document hr + h3, #pdf-render-root hr + h3, .md2pdf-document hr + h3,
  #preview-document hr + h4, #pdf-render-root hr + h4, .md2pdf-document hr + h4 {
    margin-top: 0.6em;
  }
`;

export const pdfStyles = unifiedDocumentStyles;
