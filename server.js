const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var todos = [];
var seq = 0;
function createTodo(title, order) {
  seq ++;
  const todo = {title, order, completed: false, id: seq};
  todos.push(todo);
  return todo;
}

function deleteAllTodos() {
  todos = [];
}

function createResourceLink(req, id) {
  return `${req.protocol}://${req.hostname}:${req.port}/${id}`;
}

function createTodoResource(req, todo) {
    const url = createResourceLink(req, todo.id);
    return Object.assign({}, todo, {url});
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
  res.send(todos.map(createTodoResource.bind(this, req)));
});

app.post('/', (req, res) => {
  const todo = createTodo(req.body.title, req.body.order);
  res.send(createTodoResource(req, todo));
});

app.delete('/', (req, res) => {
  deleteAllTodos();
  res.send(todos);
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
