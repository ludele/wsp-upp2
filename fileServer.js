const fs = require('fs').promises;
const path = require('path');

async function serveFile(request, response) {
  const { url } = request;
  const filePath = '.' + url;

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const contentType = getContentType(filePath);

    response.writeHead(200, { 'Content-Type': contentType });
    response.write(fileContent);
    response.end();
  } catch (error) {
    console.error(error);

    if (error.code === 'ENOENT') {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('404 Not Found');
      response.end();
    } else {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write('Internal Server Error');
      response.end();
    }
  }
}

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
}

module.exports = { serveFile };