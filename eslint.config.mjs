import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      // Explicitly set the environment to Node.js to allow 'require'
      // globals: globals.node,
    },
  },
  {
    languageOptions: {
      globals: globals.browser, // Use browser globals for other files
    },
  },
  pluginJs.configs.recommended,
];
