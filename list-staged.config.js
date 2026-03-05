// lint-staged.config.js
export default {
  "frontend/**/*.{js,jsx}": (files) => {
    const args = files.join(" ");
    return `npx --prefix frontend eslint --fix --config frontend/eslint.config.js --rule 'react-refresh/only-export-components: off' --no-warn-ignored ${args}`;
  },
  "backend/**/*.{js,ts}": (files) => {
    const args = files.join(" ");
    return `npx --prefix backend eslint --fix --config backend/eslint.config.js --no-warn-ignored ${args}`;
  },
};
