require('dotenv').config();

const { Worker } = require('bullmq');

const { env } = require('../config/env');
const { redisConnection } = require('../config/redis');
const { SUBMISSION_QUEUE_NAME } = require('../queue/submission.queue');
const { judgeSubmission } = require('../services/judge.service');
const {
  getSubmissionOrThrow,
  markSubmissionEvaluated,
  markSubmissionProcessing
} = require('../services/submission.service');

async function processSubmission(job) {
  const submissionId = job.data.submissionId;
  const submission = markSubmissionProcessing(submissionId);
  const evaluation = await judgeSubmission(submission);
  return markSubmissionEvaluated(submissionId, evaluation);
}

function startSubmissionWorker() {
  const worker = new Worker(SUBMISSION_QUEUE_NAME, processSubmission, {
    connection: redisConnection,
    concurrency: env.workerConcurrency
  });

  worker.on('ready', () => {
    console.log(`[worker] Submission worker ready with concurrency ${env.workerConcurrency}`);
  });

  worker.on('completed', (job, result) => {
    console.log(`[worker] Job ${job.id} finished with verdict ${result.verdict}`);
  });

  worker.on('failed', async (job, error) => {
    console.error(`[worker] Job ${job ? job.id : 'unknown'} failed`, error);
  });

  return worker;
}

if (require.main === module) {
  startSubmissionWorker();
}

module.exports = {
  processSubmission,
  startSubmissionWorker
};
