const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

async function register({ username, password }) {
  const existing = await userRepository.findByUsername(username);
  if (existing) throw ApiError.conflict('Username already taken');

  // bcrypt salts and hashes; the plain password is never stored.
  const passwordHash = await bcrypt.hash(password, env.saltRounds);
  const user = await userRepository.create({ username, passwordHash });
  return { user, token: signToken(user) };
}

async function login({ username, password }) {
  const found = await userRepository.findByUsername(username);
  // Same message for unknown user and wrong password: don't reveal which usernames exist.
  const valid = found && (await bcrypt.compare(password, found.password));
  if (!valid) throw ApiError.unauthorized('Invalid username or password');

  const user = { id: found.id, username: found.username };
  return { user, token: signToken(user) };
}

module.exports = { register, login };
