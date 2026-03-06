require('dotenv').config();

const { createApp } = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const { env } = require('./src/config/env');
const { initializeQueueMonitoring } = require('./src/queue/submission.queue');

async function startServer() {
  await connectDatabase();
  initializeQueueMonitoring();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[api] Verdict API listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('[api] Failed to start server', error);
  process.exit(1);
});
