module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};