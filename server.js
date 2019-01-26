require('dotenv').config(); // read .env files
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const { getRates } = require('./lib/services');

// Set public folder as root
app.use(express.static('public'));


// Listen for HTTP requests on port 5000
app.listen(port, () => {
  console.log('listening on %d', port);
});

app.get('/api/list', async (req, res) => {
  try {
    const data = await getRates();
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));