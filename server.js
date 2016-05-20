const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const todos = [];

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

app.use(corsMiddleware);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(todos);
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.send({
    title: req.body.title,
    order: req.body.order
  });
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
