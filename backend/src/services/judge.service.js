const { executeSubmission } = require('./execution.service');
const { getProblemWithTestcases } = require('./problem.service');

async function judgeSubmission(submission) {
  const problem = getProblemWithTestcases(submission.problemId);

  if (!problem) {
    const error = new Error('Problem not found for submission');
    error.statusCode = 404;
    throw error;
  }

  const sandboxRequest = {
    submissionId: submission.id,
    language: submission.language,
    sourceCode: submission.sourceCode,
    testcases: problem.testcases,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitMb: problem.memoryLimitMb
  };

  return executeSubmission(sandboxRequest);
}

module.exports = {
  judgeSubmission
};
