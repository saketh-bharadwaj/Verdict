const { randomUUID } = require('crypto');

function buildTestcase(input) {
  return {
    id: input.id || randomUUID(),
    problemId: input.problemId,
    input: input.input,
    output: input.output,
    isSample: Boolean(input.isSample),
    createdAt: input.createdAt || new Date().toISOString()
  };
}

module.exports = {
  buildTestcase
};
