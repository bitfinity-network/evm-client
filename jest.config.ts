import { defaults } from "ts-jest/presets";

module.exports = {
  ...defaults,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
