const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  postgresUrl:
    process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/verdict',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY || 2),
  executionMode: process.env.EXECUTION_MODE || 'simulation'
};

module.exports = {
  env
};
