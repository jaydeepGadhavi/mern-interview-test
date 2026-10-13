const env = require('./config/env');
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function start() {
  env.assertEnv();

  const { connectMongo } = require('./config/mongo');
  const { initMysql } = require('./config/mysql');
  const app = require('./app');

  await connectMongo();
  await initMysql();

  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}/api`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
