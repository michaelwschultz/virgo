const jestConfig = {
  verbose: true,
  moduleDirectories: [
    'node_modules',
  ],
  moduleFileExtensions: ["js", "jsx"],
  rootDir: '.',
  modulePaths: [
    '.'
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
};

module.exports = jestConfig;
