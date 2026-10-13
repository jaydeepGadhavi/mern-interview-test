process.env.JWT_SECRET = 'test-secret';
process.env.MONGO_URI = 'x';
process.env.MYSQL_HOST = 'x';
process.env.MYSQL_USER = 'x';
process.env.MYSQL_DATABASE = 'x';
process.env.BCRYPT_SALT_ROUNDS = '4';

jest.mock('../src/repositories/user.repository');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../src/repositories/user.repository');
const authService = require('../src/services/auth.service');

describe('auth.service', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('register', () => {
    it('hashes the password and returns a token', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.create.mockImplementation(async ({ username }) => ({ id: 1, username }));

      const result = await authService.register({ username: 'jay', password: 'secret123' });

      const savedHash = userRepository.create.mock.calls[0][0].passwordHash;
      expect(savedHash).not.toBe('secret123');
      expect(await bcrypt.compare('secret123', savedHash)).toBe(true);
      expect(jwt.verify(result.token, 'test-secret').username).toBe('jay');
    });

    it('rejects a duplicate username with 409', async () => {
      userRepository.findByUsername.mockResolvedValue({ id: 1, username: 'jay' });
      await expect(authService.register({ username: 'jay', password: 'secret123' })).rejects.toMatchObject({
        statusCode: 409,
      });
    });
  });

  describe('login', () => {
    it('returns a token for valid credentials', async () => {
      const password = await bcrypt.hash('secret123', 4);
      userRepository.findByUsername.mockResolvedValue({ id: 1, username: 'jay', password });

      const result = await authService.login({ username: 'jay', password: 'secret123' });
      expect(result.user).toEqual({ id: 1, username: 'jay' });
      expect(result.token).toBeDefined();
    });

    it('rejects a wrong password with 401', async () => {
      const password = await bcrypt.hash('secret123', 4);
      userRepository.findByUsername.mockResolvedValue({ id: 1, username: 'jay', password });
      await expect(authService.login({ username: 'jay', password: 'nope' })).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('rejects an unknown user with the same 401', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      await expect(authService.login({ username: 'ghost', password: 'x' })).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });
});
