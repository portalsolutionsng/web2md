chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyAsMarkdown') {
    let clone = document.body.cloneNode(true);

    // Remove script/style
    clone.querySelectorAll('script, style').forEach(el => el.remove());

    // Convert SVG → Mermaid
    const converter = new SvgToMermaidService();
     console.log("SvgToMermaidService Loaded:\n");
    clone.querySelectorAll("svg").forEach(svgEl => {
      try {
        const mermaidBlock = converter.convert(svgEl);
        if (mermaidBlock) {
          // --- DEBUGGING: log Mermaid immediately ---
          //console.log("Extracted Mermaid Diagram:\n", mermaidBlock);
 
          const pre = document.createElement("pre");
          const code = document.createElement("code");
          code.className = "language-mermaid";
          code.textContent = mermaidBlock; // raw Mermaid code, no escaping
          pre.appendChild(code);
          svgEl.replaceWith(pre);
        }
      } catch (err) {
        console.warn("Could not convert SVG to Mermaid:", err);
      }
    });

    // Markdown
    const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    let markdown = turndownService.turndown(clone.innerHTML);

    sendResponse({ status: 'success', markdown });
    return true;
  }
});