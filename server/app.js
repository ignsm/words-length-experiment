#!/usr/bin/env node
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const createExperiment = require('./controllers/createExperiment');
const http = require('http');
const bp = require('body-parser');
const cors = require('cors');
const parseExpResults = require('./middlewares/parseExpResults');
const writeFile = require('./middlewares/writeFile');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

const staticPath = path.resolve(__dirname, '..', 'dist');
const indexHTML = staticPath + "/index.html";

app.get('/', (req, res) => {
  fs.readFile(indexHTML, 'utf-8', function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

app.use(express.static(staticPath));

app.get('/generateExperiment', (req, res) => {
  const data = createExperiment();
  res.send({ data });
});

app.post('/save', (req, res) => {
  const records = req.body;
  const experimentName = new Date().toISOString();
  writeFile(experimentName, parseExpResults(records));
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
