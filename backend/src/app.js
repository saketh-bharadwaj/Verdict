const cors = require('cors');
const express = require('express');

const { apiRouter } = require('./routes');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok', service: 'verdict-api' });
  });

  app.use('/api', apiRouter);

  app.use((error, _request, response, _next) => {
    console.error('[api] Unhandled request error', error);
    response.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error'
    });
  });

  return app;
}

module.exports = {
  createApp
};
