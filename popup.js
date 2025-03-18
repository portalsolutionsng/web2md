document.getElementById('copyButton').addEventListener('click', async () => {
  // Get the active tab.
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Send a message to the content script.
  chrome.tabs.sendMessage(tab.id, { action: 'copyAsMarkdown' }, async (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      document.getElementById('message').textContent = 'Error copying text.';
      return;
    }
    if (response && response.status === 'success' && response.markdown) {
      try {
        await navigator.clipboard.writeText(response.markdown);
        document.getElementById('message').textContent = 'Copied';
      } catch (err) {
        console.error('Error copying text:', err);
        document.getElementById('message').textContent = 'Error copying text.';
      }
    } else {
      document.getElementById('message').textContent = 'Error copying text.';
    }
  });
});
