function todo(step, message) {
  throw new Error(`TODO ${step}: ${message}`);
}

module.exports = {
  todo,
};
