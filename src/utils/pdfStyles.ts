export const pdfStyles = `
  #pdf-render-root,
  #pdf-render-root *,
  #pdf-render-root *::before,
  #pdf-render-root *::after {
    box-sizing: border-box;
  }

  #pdf-render-root {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 15px;
    line-height: 1.7;
    color: #111111;
    margin: 0;
    padding: 0;
  }

  #pdf-render-root h1,
  #pdf-render-root h2,
  #pdf-render-root h3,
  #pdf-render-root h4,
  #pdf-render-root h5,
  #pdf-render-root h6 {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    line-height: 1.25;
    color: #000000;
    margin-top: 1.6em;
    margin-bottom: 0.5em;
  }
  #pdf-render-root h1 { font-size: 1.9em; margin-top: 0; }
  #pdf-render-root h2 { font-size: 1.3em; }
  #pdf-render-root h3 { font-size: 1.1em; }
  #pdf-render-root h4 { font-size: 1em; }

  #pdf-render-root p { margin: 0 0 1em 0; }
  #pdf-render-root a { color: #111111; text-decoration: underline; }
  #pdf-render-root strong { font-weight: 700; }
  #pdf-render-root em { font-style: italic; }

  #pdf-render-root code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85em;
    background-color: #f4f4f4;
    padding: 0.1em 0.35em;
    border-radius: 3px;
    white-space: nowrap;
  }
  #pdf-render-root pre {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1em 1.25em;
    margin: 0 0 1em 0;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  #pdf-render-root pre code {
    background: none;
    padding: 0;
    font-size: 0.85em;
    white-space: pre-wrap;
  }

  #pdf-render-root blockquote {
    border-left: 3px solid #cbd5e1;
    padding: 0.6em 1.2em;
    margin: 1em 0 1.5em 0;
    color: #334155;
    font-style: italic;
    background-color: #f8fafc;
    border-radius: 0 4px 4px 0;
  }
  #pdf-render-root blockquote p { margin: 0 0 0.5em 0; }
  #pdf-render-root blockquote sub,
  #pdf-render-root blockquote cite,
  #pdf-render-root blockquote small {
    display: block;
    font-style: normal;
    color: #64748b;
    font-size: 0.85em;
    margin-top: 0.5em;
    line-height: 1.4;
    position: static;
  }

  #pdf-render-root ul,
  #pdf-render-root ol {
    margin: 0 0 1em 0;
    padding-left: 1.8em;
    list-style: none;
  }
  #pdf-render-root li { margin-bottom: 0.35em; position: relative; }
  #pdf-render-root li p { margin: 0 0 0.35em 0; }
  #pdf-render-root li p:last-child { margin-bottom: 0; }

  #pdf-render-root .pdf-marker {
    position: absolute;
    left: -1.8em;
    width: 1.4em;
    text-align: right;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }
  #pdf-render-root .pdf-bullet {
    position: absolute;
    left: -1.3em;
    font-family: inherit;
    font-size: 1.1em;
    line-height: inherit;
    color: inherit;
  }

  #pdf-render-root details {
    display: block;
    margin: 1em 0 1.5em 0;
    padding: 14px 18px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }
  #pdf-render-root summary {
    display: block;
    list-style: none;
    font-weight: 700;
    font-size: 0.95em;
    color: #1e293b;
    margin-bottom: 0.75em;
    cursor: default;
  }
  #pdf-render-root summary::-webkit-details-marker,
  #pdf-render-root summary::marker {
    display: none;
  }
  #pdf-render-root details ul,
  #pdf-render-root details ol {
    margin-bottom: 0;
  }

  #pdf-render-root kbd {
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

  #pdf-render-root dl { margin: 0 0 1.25em 0; }
  #pdf-render-root dt { font-weight: 700; margin-top: 0.75em; color: #111111; }
  #pdf-render-root dd { margin: 0.2em 0 0.6em 1.5em; color: #333333; }

  #pdf-render-root mark { background-color: #fef08a; color: inherit; padding: 0.1em 0.25em; border-radius: 2px; }
  #pdf-render-root small { font-size: 0.85em; color: #555555; }
  #pdf-render-root sub,
  #pdf-render-root sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  #pdf-render-root sup { top: -0.5em; }
  #pdf-render-root sub { bottom: -0.25em; }

  #pdf-render-root div[align="center"],
  #pdf-render-root p[align="center"] { text-align: center; }

  /* Open table style: horizontal rules only, no outer border or row fills */
  #pdf-render-root table { width: 100%; border-collapse: collapse; margin-bottom: 1.5em; }
  #pdf-render-root th {
    font-weight: 700;
    text-align: left;
    padding: 0.6em 0.75em;
    border-bottom: 2px solid #222222;
    font-size: 0.95em;
  }
  #pdf-render-root td {
    padding: 0.65em 0.75em;
    border-bottom: 1px solid #cccccc;
    vertical-align: top;
  }
  #pdf-render-root tr:last-child td { border-bottom: none; }

  #pdf-render-root img { max-width: 100%; height: auto; display: inline-block; vertical-align: middle; }
  #pdf-render-root p img { margin-right: 6px; margin-bottom: 4px; }
  #pdf-render-root hr { border: none; border-top: 1px solid #cccccc; margin: 1.5em 0; }
  /* Prevent double-stacking when a heading immediately follows a divider */
  #pdf-render-root hr + h1,
  #pdf-render-root hr + h2,
  #pdf-render-root hr + h3,
  #pdf-render-root hr + h4 { margin-top: 0.6em; }
`;
