const spdy = require('spdy');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const deals = require('./deals');

const app = express();

let clients = [];
let dealsList = [];

const dealHandler = (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  dealsList = deals.generateList();
  res.write(`data: ${JSON.stringify(dealsList)} \n\n`);
  const newClientId = Date.now();
  const newClient = {
    id: newClientId,
    res,
  };
  clients.push(newClient);
  req.on(
    'close',
    () => (clients = clients.filter(client => client.id !== newClientId))
  );
};

const updateClients = newData => {
  clients.forEach(client =>
    client.res.write(`data: ${JSON.stringify(newData)} \n\n`)
  );
};

const updateData = (req, res, next) => {
  const dealId = req.query.dealId;
  const updatedList = dealsList.map(deal => {
    let newBackers = deal.currentBackers + 1;
    if (newBackers == deal.backersRequired) {
      newBackers = 'Deal Fulfilled';
    }
    const newProgress = (newBackers / deal.backersRequired) * 100;
    if (deal.id == dealId) {
      return {
        ...deal,
        currentBackers: newBackers,
        progress: newProgress,
      };
    }
    return deal;
  });
  dealsList = [...updatedList];
  res.json(updatedList);
  updateClients(updatedList);
};

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/purchase', updateData);
app.get('/products', (req, res) => res.json(deals.products));
app.get('/deals', dealHandler);

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
