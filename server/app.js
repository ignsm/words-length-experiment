#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const createExperiment = require('./controllers/createExperiment');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(createExperiment());
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
