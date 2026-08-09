/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [{ files: ['**/*.{js,jsx,ts,tsx}'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } }];
export default eslintConfig;
