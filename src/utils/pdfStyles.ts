export const pdfStyles = `
  *, *::before, *::after { box-sizing: border-box; }

  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 15px;
    line-height: 1.7;
    color: #111111;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    line-height: 1.25;
    color: #000000;
    margin-top: 1.6em;
    margin-bottom: 0.5em;
  }
  h1 { font-size: 1.9em; margin-top: 0; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.1em; }
  h4 { font-size: 1em; }

  p { margin: 0 0 1em 0; }
  a { color: #111111; text-decoration: underline; }
  strong { font-weight: 700; }
  em { font-style: italic; }

  code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85em;
    background-color: #f4f4f4;
    padding: 0.15em 0.4em;
    border-radius: 3px;
  }
  pre {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1em 1.25em;
    margin: 0 0 1em 0;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  pre code { background: none; padding: 0; font-size: 0.85em; }

  blockquote {
    border-left: 3px solid #aaaaaa;
    padding: 0.25em 1em;
    margin: 0 0 1em 1em;
    color: #444444;
  }

  ul { margin: 0 0 1em 0; padding-left: 2em; list-style-type: disc; }
  ol { margin: 0 0 1em 0; padding-left: 2em; list-style-type: decimal; }
  li { margin-bottom: 0.35em; display: list-item; }

  /* Open table style: horizontal rules only, no outer border or row fills */
  table { width: 100%; border-collapse: collapse; margin-bottom: 1.5em; }
  th {
    font-weight: 700;
    text-align: left;
    padding: 0.6em 0.75em;
    border-bottom: 2px solid #222222;
    font-size: 0.95em;
  }
  td {
    padding: 0.65em 0.75em;
    border-bottom: 1px solid #cccccc;
    vertical-align: top;
  }
  tr:last-child td { border-bottom: none; }

  img { max-width: 100%; height: auto; }
  hr { border: none; border-top: 1px solid #cccccc; margin: 1.5em 0; }
  /* Prevent double-stacking when a heading immediately follows a divider */
  hr + h1, hr + h2, hr + h3, hr + h4 { margin-top: 0.6em; }
`;
