chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyAsMarkdown') {
    // Clone the document body to avoid modifying the live DOM.
    let clone = document.body.cloneNode(true);
    
    const turndownService = new TurndownService();
   
    // Remove all script and style elements from the clone.
    let elementsToRemove = clone.querySelectorAll('script, style');
    elementsToRemove.forEach(el => el.remove()); 
    
    // Convert the cleaned HTML to Markdown.
    let markdown = turndownService.turndown(clone.innerHTML);
    
    
    sendResponse({ status: 'success', markdown: markdown });
    return true;
  }
});
