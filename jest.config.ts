// jest.config.js or jest.config.ts
const { defaults } = require("ts-jest/presets");
module.exports = {
  ...defaults,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
       "^.+\\.jsx?$": "babel-jest"
    }
};