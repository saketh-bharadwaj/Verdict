const { env } = require('../config/env');

const VERDICTS = {
  ACCEPTED: 'AC',
  WRONG_ANSWER: 'WA',
  TIME_LIMIT_EXCEEDED: 'TLE',
  RUNTIME_ERROR: 'RE'
};

async function executeSubmission(request) {
  if (env.executionMode === 'docker') {
    return runInDockerSandbox(request);
  }

  return simulateExecution(request);
}

async function simulateExecution(request) {
  const source = request.sourceCode.toLowerCase();
  const testcaseCount = request.testcases.length || 1;

  let verdict = VERDICTS.ACCEPTED;

  if (source.includes('runtime_error')) {
    verdict = VERDICTS.RUNTIME_ERROR;
  } else if (source.includes('while(true)') || source.includes('sleep(')) {
    verdict = VERDICTS.TIME_LIMIT_EXCEEDED;
  } else if (source.includes('wrong_answer')) {
    verdict = VERDICTS.WRONG_ANSWER;
  }

  return {
    verdict,
    executionTime: Math.min(50 + request.sourceCode.length + testcaseCount * 7, 2000),
    memoryUsed: Math.min(16 + testcaseCount * 4, request.memoryLimitMb),
    metadata: {
      mode: 'simulation',
      testcaseCount
    }
  };
}

async function runInDockerSandbox(request) {
  return {
    verdict: VERDICTS.RUNTIME_ERROR,
    executionTime: request.timeLimitMs,
    memoryUsed: request.memoryLimitMb,
    metadata: {
      mode: 'docker',
      message:
        'Docker execution is intentionally left as a future integration point. Replace this method with image selection, container lifecycle management, and cgroup enforcement.'
    }
  };
}

module.exports = {
  VERDICTS,
  executeSubmission
};
