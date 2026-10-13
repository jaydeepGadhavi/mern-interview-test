const mysql = require('mysql2/promise');
const env = require('./env');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...env.mysql,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

// Creates the database (if missing) and the tables this app needs.
async function initMysql() {
  const { database, ...serverConfig } = env.mysql;
  const bootstrap = await mysql.createConnection(serverConfig);
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await bootstrap.end();

  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // product_ids holds Mongo ObjectId strings, so it is a JSON array (products live in MongoDB).
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_ids JSON NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('MySQL ready');
}

module.exports = { getPool, initMysql };
