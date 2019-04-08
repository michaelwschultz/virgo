const REGEX = {
  css: '^.+\\.css$',
  file: '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$',
  js: '^.+\\.js$',
};

const jestConfig = {
  verbose: true,
  moduleDirectories: [
    '<rootDir>/node_modules',
  ],
  moduleFileExtensions: ["js", "jsx"],
  rootDir: '..',
  modulePaths: [
    '<rootDir>'
  ],
};

module.exports = jestConfig;
