const { buildProblem } = require('../models/problem.model');
const { buildTestcase } = require('../models/testcase.model');

const problems = new Map();
const testcases = new Map();

function seedProblems() {
  const sampleProblem = buildProblem({
    title: 'A + B Problem',
    statement: 'Read two integers and print their sum.',
    difficulty: 'beginner',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    createdBy: 'system'
  });

  const sampleTestcases = [
    buildTestcase({
      problemId: sampleProblem.id,
      input: '1 2',
      output: '3',
      isSample: true
    }),
    buildTestcase({
      problemId: sampleProblem.id,
      input: '10 20',
      output: '30',
      isSample: false
    })
  ];

  problems.set(sampleProblem.id, sampleProblem);
  testcases.set(sampleProblem.id, sampleTestcases);
}

seedProblems();

function listProblems() {
  return Array.from(problems.values()).map((problem) => ({
    ...problem,
    testcaseCount: getTestcasesByProblemId(problem.id).length
  }));
}

function getProblemById(problemId) {
  return problems.get(problemId) || null;
}

function getProblemWithTestcases(problemId) {
  const problem = getProblemById(problemId);

  if (!problem) {
    return null;
  }

  return {
    ...problem,
    testcases: getTestcasesByProblemId(problemId)
  };
}

function getTestcasesByProblemId(problemId) {
  return testcases.get(problemId) || [];
}

function createProblem(input) {
  const problem = buildProblem(input);
  const problemTestcases = (input.testcases || []).map((testcase) =>
    buildTestcase({
      ...testcase,
      problemId: problem.id
    })
  );

  problems.set(problem.id, problem);
  testcases.set(problem.id, problemTestcases);

  return {
    ...problem,
    testcases: problemTestcases
  };
}

module.exports = {
  createProblem,
  getProblemById,
  getProblemWithTestcases,
  getTestcasesByProblemId,
  listProblems
};
