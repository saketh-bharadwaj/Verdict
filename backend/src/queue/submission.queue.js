const { Queue, QueueEvents } = require('bullmq');

const { redisConnection } = require('../config/redis');

const SUBMISSION_QUEUE_NAME = 'submission-evaluations';

const submissionQueue = new Queue(SUBMISSION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: 1000,
    removeOnFail: 5000
  }
});

const submissionQueueEvents = new QueueEvents(SUBMISSION_QUEUE_NAME, {
  connection: redisConnection
});

async function enqueueSubmission(submission) {
  return submissionQueue.add('evaluate-submission', {
    submissionId: submission.id
  });
}

function initializeQueueMonitoring() {
  submissionQueueEvents.on('completed', ({ jobId }) => {
    console.log(`[queue] submission job ${jobId} completed`);
  });

  submissionQueueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`[queue] submission job ${jobId} failed: ${failedReason}`);
  });
}

module.exports = {
  SUBMISSION_QUEUE_NAME,
  enqueueSubmission,
  initializeQueueMonitoring,
  submissionQueue
};
