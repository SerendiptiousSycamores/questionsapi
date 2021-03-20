const express = require('express')
const app = express()
const qaRouter = require('../src/routes/questionsRouter.js');

app.use(express.json());

app.use('/qa', qaRouter);

module.exports = app;