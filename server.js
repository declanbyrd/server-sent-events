const express = require('express');
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

const countdown = (res, count) => {
  const data = {
    countdown: count,
    progress: 100 - count,
  };
  res.write(`data: ${JSON.stringify(data)} \n\n`);
  if (count) setTimeout(() => countdown(res, count - 1), 1000);
  else res.end();
};

app.listen(8080, () => console.log('Server is listening on port 8080'));
