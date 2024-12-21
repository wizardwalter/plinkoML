import { createServer } from 'http';
import { readFile } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Recreate __dirname in ES Module context
const __dirname = dirname(fileURLToPath(import.meta.url));

// Define the path to index.html
const filePath = join(__dirname, 'index.html');

// Create the server
const server = createServer((req, res) => {
  readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

// Start the server and log an error if it fails
server.listen(8080, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log('Server running at http://localhost:8080/');
});

// Log server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});
