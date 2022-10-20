#!/usr/bin/env node
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const bp = require('body-parser');
const cors = require('cors');
const createExperiment = require('./middlewares/createExperiment');
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
  const rounds = req.query.rounds || 30;
  const wordsPerRound = req.query.wordsPerRound || 6;
  const data = createExperiment(rounds, wordsPerRound);
  res.send({ data });
});

app.post('/save', (req, res) => {
  const records = req.body;
  const experimentName = new Date().toISOString();
  writeFile(experimentName, parseExpResults(records));
  res.send({ status: 'ok' });
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
