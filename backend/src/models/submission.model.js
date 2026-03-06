const { randomUUID } = require('crypto');

function buildSubmission(input) {
  const now = new Date().toISOString();

  return {
    id: input.id || randomUUID(),
    userId: input.userId,
    problemId: input.problemId,
    language: input.language,
    sourceCode: input.sourceCode,
    verdict: input.verdict || 'PENDING',
    executionTime: input.executionTime || null,
    memoryUsed: input.memoryUsed || null,
    status: input.status || 'QUEUED',
    queueJobId: input.queueJobId || null,
    createdAt: input.createdAt || now,
    updatedAt: now
  };
}

module.exports = {
  buildSubmission
};
