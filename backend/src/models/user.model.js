const { randomUUID } = require('crypto');

function buildUser(input) {
  return {
    id: input.id || randomUUID(),
    handle: input.handle,
    email: input.email,
    role: input.role || 'competitor',
    createdAt: input.createdAt || new Date().toISOString()
  };
}

module.exports = {
  buildUser
};
