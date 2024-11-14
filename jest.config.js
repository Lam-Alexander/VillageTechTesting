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
  testEnvironment: "jsdom", // Ensure this line is added to use the jsdom environment for React testing
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: "./client/coverage", // Specify the directory where Jest should output coverage files
  coverageReporters: ["text", "lcov", "json", "cobertura"], // Choose the format for the coverage report
};
