const express = require('express');

const { problemRouter } = require('./problem.routes');
const { submissionRouter } = require('./submission.routes');

const apiRouter = express.Router();

apiRouter.use('/problems', problemRouter);
apiRouter.use('/submission', submissionRouter);

module.exports = {
  apiRouter
};
