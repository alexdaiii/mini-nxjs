/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "google",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    quotes: ["error", "double"],
    // disable generator-star-spacing rule
    "generator-star-spacing": "off",
    "indent": 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/no-unused-vars": "off",
  },
};
