module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-package-to-transform|other-packages).+\\.js$",
  ],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }],
  ],
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "./client/coverage", // Change this line to save coverage inside the client/coverage folder
  coverageReporters: ["text", "lcov", "json", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
};
