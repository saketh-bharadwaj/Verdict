const { randomUUID } = require('crypto');

function toSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildProblem(input) {
  const now = new Date().toISOString();

  return {
    id: input.id || randomUUID(),
    title: input.title,
    slug: input.slug || toSlug(input.title),
    statement: input.statement || '',
    difficulty: input.difficulty || 'unrated',
    timeLimitMs: Number(input.timeLimitMs || 1000),
    memoryLimitMb: Number(input.memoryLimitMb || 256),
    createdBy: input.createdBy || null,
    createdAt: input.createdAt || now,
    updatedAt: now
  };
}

module.exports = {
  buildProblem
};
