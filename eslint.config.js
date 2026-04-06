const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "import/no-named-as-default-member": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "__mocks__/**"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
      "jest.config.js",
      "eslint.config.js",
    ],
  },
];
