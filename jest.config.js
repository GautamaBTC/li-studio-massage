/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  // Jest's default test environment is 'node', which doesn't have 'window' or 'localStorage'.
  // 'jsdom' provides these browser-like globals.
  testEnvironment: 'jsdom',
};

export default config;
