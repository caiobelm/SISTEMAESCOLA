module.exports = {
  extends: ['../../packages/eslint/index.js'],
  parserOptions: {
    project: ['./tsconfig.json']
  },
  ignorePatterns: ['dist']
};
