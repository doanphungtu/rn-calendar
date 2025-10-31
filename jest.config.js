module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
};
