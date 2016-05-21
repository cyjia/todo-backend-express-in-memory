function createResourceLink(req, id) {
  return `${req.protocol}://${req.get('host')}/${id}`;
}

function createTodoResource(req, todo) {
  const url = createResourceLink(req, todo.id);
  return Object.assign({}, todo, {url});
}

const sendTodo = (req, res, next) => {
  res.send(createTodoResource(req, req.todo));
  next();
};

const sendTodos = (req, res, next) => {
  res.send(req.todos.map(createTodoResource.bind(this, req)));
  next();
};

function resourceMiddleware(app, actions) {
  app.get('/', (req, res, next) => {
    req.todos = actions.findAll();
    next();
  }, sendTodos);

  app.post('/', (req, res, next) => {
    req.todo = actions.create(req.body.title, req.body.order);
    next();
  }, sendTodo);

  app.delete('/', (req, res, next) => {
    req.todos = actions.deleteAll();
    next();
  }, sendTodos);

  app.get('/:id', (req, res, next) => {
    req.todo = actions.findById(req.params.id);
    next();
  }, sendTodo);

  app.patch('/:id', (req, res, next) => {
    req.todo = actions.update({
      id: req.params.id,
      title: req.body.title,
      completed: req.body.completed,
      order: req.body.order
    });
    next();
  }, sendTodo);

  app.delete('/:id', (req, res, next) => {
    req.todo = actions.deleteById(req.params.id);
    next();
  }, sendTodo);

}

module.exports = resourceMiddleware;
