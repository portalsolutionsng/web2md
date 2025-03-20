# Copy as Markdown Extension

A lightweight Chrome extension that copies the content of a web page as Markdown—perfect for passing content directly to language models (LLMs) or any text processing tool. If you face error trying refreshing the page and then use the extension. Be careful about prompt injection. Certain pages might contain malicious instruction which can cause issue
with LLM.

## Features

- **Convert to Markdown:** Transforms the visible content of any web page into Markdown format.
- **Clean Content:** Removes all JavaScript and CSS (i.e. `<script>` and `<style>` tags) so that only the text is captured.
- **Clipboard Integration:** Automatically copies the processed Markdown to your clipboard with a single click.
- **LLM-Ready:** Easily pass the clean, Markdown-formatted text to language models or other tools.

## How It Works

1. **User Interaction:** Click the "Copy as Markdown" button from the extension’s popup.
2. **Content Processing:**  
   - A content script clones the current page's `<body>`.
   - It then removes all `<script>` and `<style>` elements to strip out unwanted JS/CSS.
   - The  [Turndown](https://github.com/mixmark-io/turndown) library converts the cleaned HTML into Markdown.
   - Post‑processing steps remove any lingering markdown syntax so that only the visible text remains.
3. **Clipboard Copy:** The processed Markdown is sent back to the popup, which copies it to the clipboard.
4. **Feedback:** A “Copied” message is displayed in the popup once the operation is successful.
5. **Session Mode:**  
  - **Copy from Multiple Pages:** Activate session mode to copy and aggregate content from multiple pages during a single browsing session.
  - **Persistent Aggregation:** Each page you copy while in session mode gets appended to an aggregated text stored locally.
  - **Visual Feedback:** See messages indicating which pages have been copied.
  - **Session End:** Stop the session to clear the local state (without affecting the clipboard), so you can start a new aggregation later.

## Installation

1. **Clone or Download:**  
   Clone this repository or download the source code to your local machine.
2. **Load the Extension:**  
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top-right corner.
   - Click "Load unpacked" and select the folder containing the extension files.
3. **Use the Extension:**  
   The extension icon will now appear in your Chrome toolbar. Click it to open the popup and use the "Copy as Markdown" button.

## Files Included

- **manifest.json:**  
  Declares the extension’s metadata, permissions, and the scripts to be loaded.
- **popup.html:**  
  Provides the UI for the extension’s popup.
- **popup.js:**  
  Handles user interactions within the popup, including sending messages to the content script and copying text to the clipboard.
- **content.js:**  
  Processes the active webpage by cleaning unwanted elements and converting HTML content into Markdown.
- **turndown.js:**  
  The full Turndown library used for converting HTML to Markdown . https://github.com/mixmark-io/turndown


## Usage

1. **Normal Mode:**
   - Open any webpage.
   - Click the **Copy as Markdown** button to copy the current page's plain text to your clipboard.

2. **Session Mode:**
   - Click the **Session: Copy from multiple web pages** button to start a session.
   - The button text changes to **Stop Session**.
   - Now navigate through different pages; clicking **Copy as Markdown** on each page appends that page’s content to a local session state.
   - A message will appear below the session button for each page copied (e.g., “Page 1 copied.”).
   - When finished, click **Stop Session**. This clears the session state locally while keeping the aggregated text in your clipboard.

## Contributing

Contributions, suggestions, and bug reports are welcome! Please open an issue or submit a pull request on the repository.

## License

This project is licensed under the [MIT License](LICENSE).
Check turndown's license in NOTICE.md

