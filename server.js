const spdy = require('spdy');
const express = require('express');
const fs = require('fs');

const countdown = require('./utils/countdown');

const app = express();

app.use(express.static('public'));

app.get('/countdown', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  countdown(res, 100);
});

const options = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
  allowHTTP1: true,
};

const server = spdy.createServer(options, app);

server.listen(8080, error => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log('Listening on port 8080');
  }
});
