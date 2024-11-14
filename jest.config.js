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
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }], // Add JUnit reporter
  ],
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "./client/coverage", // Change this line to save coverage inside the client/coverage folder
  coverageReporters: ["text", "lcov", "json", "cobertura"], // Choose the format for the coverage report

};
