const express = require('express');

const {
  getSubmission,
  postSubmission
} = require('../controllers/submission.controller');

const submissionRouter = express.Router();

submissionRouter.post('/', postSubmission);
submissionRouter.get('/:id', getSubmission);

module.exports = {
  submissionRouter
};
