const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var todos = [];
function createTodo(title, order) {
  const todo = {title, order, completed: false};
  todos.push(todo);
  return todo;
}

function deleteAllTodos() {
  todos = [];
}
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
  const todo = createTodo(req.body.title, req.body.order);
  res.send(todo);
});

app.delete('/', (req, res) => {
  deleteAllTodos();
  res.send(todos);
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
