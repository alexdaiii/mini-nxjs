import type {JestConfigWithTsJest} from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  // [...]
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // the content you'd placed at "global"
        useESM: true,
      },
    ],
  },
};

export default jestConfig;
