const express = require('express');

const { getProblems, postProblem } = require('../controllers/problem.controller');

const problemRouter = express.Router();

problemRouter.get('/', getProblems);
problemRouter.post('/', postProblem);

module.exports = {
  problemRouter
};
