// Sanitize markdown: allow *bold*, _italic_, `code`, links (validated), block all HTML tags
const sanitizeHtml = require("sanitize-html");

function sanitizeMarkdown(input) {
  // Remove all HTML tags
  let clean = sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  // Optionally, further restrict or allow markdown patterns here
  // (e.g., allow *bold*, _italic_, `code`, [link](url))
  // For now, just strip HTML and return
  return clean;
}

function sanitizeBio(input) {
  // Remove HTML, limit to 500 chars
  let clean = sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  return clean.slice(0, 500);
}

module.exports = { sanitizeMarkdown, sanitizeBio };
