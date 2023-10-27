module.exports = {
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "all",
  semi: true,
  importOrder: ["^@/(.*)$", "^[./]", "^[~/]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  bracketSpacing: false,
  arrowParens: "avoid",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
