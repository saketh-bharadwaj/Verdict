const { createProblem, listProblems } = require('../services/problem.service');

function getProblems(_request, response) {
  response.json({
    data: listProblems()
  });
}

function postProblem(request, response, next) {
  try {
    const { title, statement, timeLimitMs, memoryLimitMb, difficulty, testcases } = request.body;

    if (!title) {
      const error = new Error('title is required');
      error.statusCode = 400;
      throw error;
    }

    const problem = createProblem({
      title,
      statement,
      timeLimitMs,
      memoryLimitMb,
      difficulty,
      testcases
    });

    response.status(201).json({
      data: problem
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProblems,
  postProblem
};
