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
  collectCoverageFrom: [
    "client/src/**/*.{js,jsx}", // Adjust this path to target your source files
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
