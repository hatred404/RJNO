# RJNO Refactoring Notes

This version keeps the existing HTML/CSS design and behavior while improving code organization.

## JavaScript
- Centralized initialization in `initPortfolio()`.
- Added small `$` / `$$` DOM helpers.
- Removed the global `window.showAppToast`.
- Removed the unused `minDistance` scrollspy variable.
- Replaced inline `onsubmit` JavaScript with an event listener.
- Kept clipboard fallback behavior.
- Added clearer function boundaries and comments.

## HTML
- Removed the inline JavaScript from the contact form.

## Server
- Kept the simple Node server.
- Added safer path resolution to prevent path traversal.
- Added JPEG MIME support.
- Simplified response/error handling.

## Important
No framework migration was performed. The project remains plain HTML, CSS, and JavaScript so the current visual design and workflow stay intact.
