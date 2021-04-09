module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/internals/jestSettings.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleNameMapper: {
    // https://jestjs.io/docs/en/webpack#handling-static-assets
    '\\.(css|scss)$': '<rootDir>/internals/__mocks__/styleMock.js',
    '^src(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
};
