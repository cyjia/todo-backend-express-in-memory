const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const TodoRepo = require('./todo-repo');

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
  req.todos = TodoRepo.findAll();
  next();
}, sendTodos);

app.post('/', (req, res, next) => {
  req.todo = TodoRepo.create(req.body.title, req.body.order);
  next();
}, sendTodo);

app.delete('/', (req, res, next) => {
  req.todos = TodoRepo.deleteAll();
  next();
}, sendTodos);

app.get('/:id', (req, res, next) => {
  req.todo = TodoRepo.findById(req.params.id);
  next();
}, sendTodo);

app.patch('/:id', (req, res, next) => {
  req.todo = TodoRepo.update({
    id: req.params.id,
    title: req.body.title,
    completed: req.body.completed,
    order: req.body.order
  });
  next();
}, sendTodo);

app.delete('/:id', (req, res, next) => {
  req.todo = TodoRepo.deleteById(req.params.id);
  next();
}, sendTodo);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
