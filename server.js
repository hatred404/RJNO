const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((request, response) => {
  const filePath = resolveFilePath(request.url);

  if (!filePath) {
    sendText(response, 400, '400 Bad Request');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      const status = error.code === 'ENOENT' ? 404 : 500;
      const message = status === 404 ? '404 Not Found' : `Server Error: ${error.code}`;

      sendText(response, status, message);
      return;
    }

    const extension = path.extname(filePath).toLowerCase();

    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });

    response.end(content);
  });
});

function resolveFilePath(requestUrl = '/') {
  const pathname = decodeURIComponent(requestUrl.split('?')[0]);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT_DIR, relativePath);

  // Prevent requests from escaping the project directory.
  if (filePath !== ROOT_DIR && !filePath.startsWith(`${ROOT_DIR}${path.sep}`)) {
    return null;
  }

  return filePath;
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  response.end(message);
}

server.listen(PORT, () => {
  console.log(`Portfolio live at http://localhost:${PORT}`);
});
