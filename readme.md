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
   - The full [Turndown](https://github.com/domchristie/turndown) library converts the cleaned HTML into Markdown.
   - Post‑processing steps remove any lingering markdown syntax so that only the visible text remains.
3. **Clipboard Copy:** The processed Markdown is sent back to the popup, which copies it to the clipboard.
4. **Feedback:** A “Copied” message is displayed in the popup once the operation is successful.

## Installation

1. **Clone or Download:**  
   Clone this repository or download the source code to your local machine.
2. **Download Turndown:**  
   Download the full Turndown library from [here](https://github.com/domchristie/turndown) or from a CDN. Save the file as `turndown.js` in the extension folder.
3. **Load the Extension:**  
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top-right corner.
   - Click "Load unpacked" and select the folder containing the extension files.
4. **Use the Extension:**  
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
  The full Turndown library used for converting HTML to Markdown (must be downloaded separately).

## Usage

1. Open any webpage.
2. Click the extension icon to open the popup.
3. Click the "Copy as Markdown" button.
4. The extension processes the page content and copies the Markdown-formatted text to your clipboard.
5. Paste the content directly into your favorite text editor or an LLM interface.

## Contributing

Contributions, suggestions, and bug reports are welcome! Please open an issue or submit a pull request on the repository.

## License

This project is licensed under the [MIT License](LICENSE).

