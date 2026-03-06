const { buildSubmission } = require('../models/submission.model');

const submissions = new Map();

function createSubmission(input) {
  const submission = buildSubmission(input);
  submissions.set(submission.id, submission);
  return submission;
}

function getSubmissionById(submissionId) {
  return submissions.get(submissionId) || null;
}

function getSubmissionOrThrow(submissionId) {
  const submission = getSubmissionById(submissionId);

  if (!submission) {
    const error = new Error('Submission not found');
    error.statusCode = 404;
    throw error;
  }

  return submission;
}

function markSubmissionQueued(submissionId, queueJobId) {
  const submission = getSubmissionOrThrow(submissionId);
  const updatedSubmission = {
    ...submission,
    queueJobId,
    status: 'QUEUED',
    updatedAt: new Date().toISOString()
  };

  submissions.set(submissionId, updatedSubmission);
  return updatedSubmission;
}

function markSubmissionProcessing(submissionId) {
  const submission = getSubmissionOrThrow(submissionId);
  const updatedSubmission = {
    ...submission,
    status: 'PROCESSING',
    updatedAt: new Date().toISOString()
  };

  submissions.set(submissionId, updatedSubmission);
  return updatedSubmission;
}

function markSubmissionEvaluated(submissionId, evaluation) {
  const submission = getSubmissionOrThrow(submissionId);
  const updatedSubmission = {
    ...submission,
    verdict: evaluation.verdict,
    executionTime: evaluation.executionTime,
    memoryUsed: evaluation.memoryUsed,
    status: 'FINISHED',
    updatedAt: new Date().toISOString()
  };

  submissions.set(submissionId, updatedSubmission);
  return updatedSubmission;
}

module.exports = {
  createSubmission,
  getSubmissionById,
  getSubmissionOrThrow,
  markSubmissionEvaluated,
  markSubmissionProcessing,
  markSubmissionQueued
};
