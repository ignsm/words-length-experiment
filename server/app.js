#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const createExperiment = require('./controllers/createExperiment');
const http = require('http');
const bp = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const data = createExperiment();
  res.send({ data });
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
