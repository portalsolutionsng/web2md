// Utility functions to get/set session state from chrome.storage.local.
function getSessionState(callback) {
  chrome.storage.local.get(["sessionActive", "sessionData"], (result) => {
    callback({
      sessionActive: result.sessionActive || false,
      sessionData: result.sessionData || []
    });
  });
}

function setSessionState(state, callback) {
  chrome.storage.local.set(state, callback);
}

// Update the session messages UI.
function updateSessionUI(sessionData) {
  const sessionMessageDiv = document.getElementById('sessionMessage');
  sessionMessageDiv.innerHTML = '';
  if (sessionData.length > 0) {
    sessionData.forEach((entry, index) => {
      let p = document.createElement('p');
      p.textContent = `Page ${index + 1} copied.`;
      sessionMessageDiv.appendChild(p);
    });
  }
}

// On load, check session state to update the UI accordingly.
document.addEventListener('DOMContentLoaded', () => {
  getSessionState((state) => {
    const sessionButton = document.getElementById('sessionButton');
    if (state.sessionActive) {
      sessionButton.textContent = 'Stop Session';
      updateSessionUI(state.sessionData);
    } else {
      sessionButton.textContent = 'Session: Copy from multiple web pages';
    }
  });
});

// Copy button event: Send message to content script to get the Markdown text.
document.getElementById('copyButton').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'copyAsMarkdown' }, async (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      document.getElementById('message').textContent = 'Error copying text.';
      return;
    }
    if (response && response.status === 'success' && response.markdown) {
      // Check if session mode is active.
      getSessionState(async (state) => {
        if (state.sessionActive) {
          // Append the new page's markdown to the sessionData array.
          state.sessionData.push(response.markdown);
          setSessionState({ sessionData: state.sessionData }, async () => {
            // Aggregate the texts from all pages.
            const aggregatedText = state.sessionData.join('\n\n');
            try {
              await navigator.clipboard.writeText(aggregatedText);
              document.getElementById('message').textContent = 'Page copied and aggregated.';
              updateSessionUI(state.sessionData);
            } catch (err) {
              console.error('Error copying text:', err);
              document.getElementById('message').textContent = 'Error copying text.';
            }
          });
        } else {
          // Not in session mode: simply copy the current page's markdown.
          try {
            await navigator.clipboard.writeText(response.markdown);
            document.getElementById('message').textContent = 'Copied';
          } catch (err) {
            console.error('Error copying text:', err);
            document.getElementById('message').textContent = 'Error copying text.';
          }
        }
      });
    } else {
      document.getElementById('message').textContent = 'Error copying text.';
    }
  });
});

// Session button event: Toggle session mode.
document.getElementById('sessionButton').addEventListener('click', () => {
  getSessionState((state) => {
    const sessionButton = document.getElementById('sessionButton');
    if (!state.sessionActive) {
      // Start session: set active and clear previous sessionData.
      setSessionState({ sessionActive: true, sessionData: [] }, () => {
        sessionButton.textContent = 'Stop Session';
        document.getElementById('sessionMessage').textContent = 'Session started.';
      });
    } else {
      // Stop session: clear the session state (local session data is cleared, but clipboard remains unchanged).
      setSessionState({ sessionActive: false, sessionData: [] }, () => {
        sessionButton.textContent = 'Session: Copy from multiple web pages';
        document.getElementById('sessionMessage').textContent = 'Session ended and data cleared.';
      });
    }
  });
});
