import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "18.3" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "no-unused-vars": "off",
      // 'import/no-unresolved': 'error', // Flag unresolved imports
      // 'import/named': 'error', // Ensure named imports exist in the module
      // 'import/default': 'error', // Ensure a default export is available
      // 'import/export': 'error', // Ensure exports match correctly
      // 'import/no-duplicates': 'warn', // Avoid duplicate imports
      // 'import/order': [
      //   'warn',
      //   {
      //     groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      //     'newlines-between': 'always',
      //   },
      // ],
    },
  },
];
