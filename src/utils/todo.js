class TodoError extends Error {
  constructor(step, message) {
    super(`TODO ${step}: ${message}`);
    this.name = 'TodoError';
  }
}

function todo(step, message) {
  throw new TodoError(step, message);
}

function isTodoError(error) {
  return error instanceof TodoError;
}

module.exports = {
  isTodoError,
  todo,
  TodoError,
};
