var todos = [];
var seq = 0;

function findAll() {
  return todos;
}

function create(title, order) {
  seq ++;
  const todo = {title, order, completed: false, id: seq};
  todos.push(todo);
  return todo;
}

function deleteAll() {
  todos = [];
  return todos;
}

function findById(id) {
  return todos.find(x => x.id == id);
}

function update(data) {
  const todo = findById(data.id);
  if (data.title) {
    todo.title = data.title;
  }

  if (data.completed !== undefined) {
    todo.completed = data.completed;
  }

  if (data.order) {
    todo.order = data.order;
  }

  return todo;
}

function deleteById(id) {
  const todo = findById(id);
  todos = todos.filter(x => x.id != id);
  return todo;
};

module.exports = {
  findAll,
  create,
  deleteAll,
  findById,
  deleteById,
  update
};
