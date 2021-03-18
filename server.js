const express = require('express')
const app = express()
const port = 3000
const qaRouter = require('./src/routes/questionsRouter.js');

app.use(express.json());

app.use('/qa', qaRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})