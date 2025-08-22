import { svgToMermaid } from "./svgToMermaid.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyAsMarkdown') {
    // Clone the document body to avoid modifying the live DOM.
    let clone = document.body.cloneNode(true);

    // Remove all script and style elements from the clone.
    let elementsToRemove = clone.querySelectorAll('script, style');
    elementsToRemove.forEach(el => el.remove());

    // ✅ Replace SVGs with Mermaid code blocks
    clone.querySelectorAll("svg").forEach(svgEl => {
      try {
        const mermaidBlock = svgToMermaid(svgEl);
        if (mermaidBlock) {
          const pre = document.createElement("pre");
          pre.textContent = mermaidBlock;
          svgEl.replaceWith(pre);
        }
      } catch (err) {
        console.warn("Could not convert SVG to Mermaid:", err);
      }
    });

    // Convert the cleaned HTML (with Mermaid blocks injected) to Markdown.
    const turndownService = new TurndownService();
    let markdown = turndownService.turndown(clone.innerHTML);

    sendResponse({ status: 'success', markdown: markdown });
    return true;
  }
});