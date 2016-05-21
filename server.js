const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const TodoRepo = require('./todo-repo');
const resourceMiddleware = require('./resource-middleware');

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

app.use(corsMiddleware);
app.use(bodyParser.json());

resourceMiddleware(app, {
  path: '',
  actions: TodoRepo
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
