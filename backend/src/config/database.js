const { env } = require('./env');

async function connectDatabase() {
  console.log(`[db] Database configured for ${env.postgresUrl}`);
  console.log('[db] Using in-memory repositories for the initial scaffold.');
}

module.exports = {
  connectDatabase
};
