const { getPool } = require('../config/mysql');

// Repository = the only layer that talks to MySQL for users.
async function create({ username, passwordHash }) {
  const [result] = await getPool().execute('INSERT INTO users (username, password) VALUES (?, ?)', [
    username,
    passwordHash,
  ]);
  return { id: result.insertId, username };
}

async function findByUsername(username) {
  const [rows] = await getPool().execute('SELECT id, username, password FROM users WHERE username = ?', [
    username,
  ]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await getPool().execute('SELECT id, username FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { create, findByUsername, findById };
