module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Load setupTests.js before running tests
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest to transform JavaScript and TypeScript
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/" // Ensure axios and any other ESM packages are transformed
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS and style imports
  },
  testEnvironment: "jsdom", // Simulate a browser environment for React tests
};
