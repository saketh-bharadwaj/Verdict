const { enqueueSubmission } = require('../queue/submission.queue');
const { getProblemById } = require('../services/problem.service');
const {
  createSubmission,
  getSubmissionById,
  markSubmissionQueued
} = require('../services/submission.service');

async function postSubmission(request, response, next) {
  try {
    const { userId, problemId, language, sourceCode } = request.body;

    if (!userId || !problemId || !language || !sourceCode) {
      const error = new Error('userId, problemId, language, and sourceCode are required');
      error.statusCode = 400;
      throw error;
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      const error = new Error('problemId does not reference an existing problem');
      error.statusCode = 404;
      throw error;
    }

    const submission = createSubmission({
      userId,
      problemId,
      language,
      sourceCode
    });

    const job = await enqueueSubmission(submission);
    const queuedSubmission = markSubmissionQueued(submission.id, job.id);

    response.status(202).json({
      data: queuedSubmission
    });
  } catch (error) {
    next(error);
  }
}

function getSubmission(request, response, next) {
  try {
    const submission = getSubmissionById(request.params.id);

    if (!submission) {
      const error = new Error('Submission not found');
      error.statusCode = 404;
      throw error;
    }

    response.json({
      data: submission
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSubmission,
  postSubmission
};
