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

function findById(id) {
  return todos.find(x => x.id == id);
}

function updateTodo(data) {
  const todo = findById(data.id);
  if (data.title) {
    todo.title = data.title;
  }

  if (data.completed) {
    todo.completed = data.completed;
  }

  return todo;
}

function createResourceLink(req, id) {
  return `${req.protocol}://${req.get('host')}/${id}`;
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

const sendTodo = (req, res, next) => {
  res.send(createTodoResource(req, req.todo));
  next();
};

const sendTodos = (req, res, next) => {
  res.send(req.todos.map(createTodoResource.bind(this, req)));
  next();
};

app.use(corsMiddleware);
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  req.todos = todos;
  next();
}, sendTodos);

app.post('/', (req, res, next) => {
  req.todo = createTodo(req.body.title, req.body.order);
  next();
}, sendTodo);

app.delete('/', (req, res, next) => {
  deleteAllTodos();
  req.todos = todos;
  next();
}, sendTodos);

app.get('/:id', (req, res, next) => {
  req.todo = findById(req.params.id);
  next();
}, sendTodo);

app.patch('/:id', (req, res, next) => {
  req.todo = updateTodo({
    id: req.params.id,
    title: req.body.title,
    completed: req.body.completed
  });
  next();
}, sendTodo);

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
