import { pathsToModuleNameMapper, type JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>" }),
};

export default config;
