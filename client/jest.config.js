module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // This tells Jest to use Babel to transform JavaScript and JSX files
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-package-to-transform|other-packages).+\\.js$", // Optional: Only transform specific node_modules packages if necessary
  ],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy", // Mock CSS imports
  },
};
