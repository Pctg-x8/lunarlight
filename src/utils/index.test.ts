import { expect, test } from "@jest/globals";
import * as fc from "fast-check";
import { describe, it } from "node:test";
import { stripPrefix, stripSuffix } from ".";

test("helper tools", () => {
  describe("stripPrefix", () => {
    it("strips arbitrary prefixes", () =>
      fc.assert(
        fc.property(fc.string(), fc.string(), (prefix, suffix) => {
          expect(stripPrefix(prefix + suffix, prefix)).toStrictEqual(suffix);
        })
      ));
    it("no conversions if prefix does not match", () =>
      fc.assert(
        fc.property(
          fc.string().filter(x => !x.startsWith("testtest")),
          x => {
            expect(stripPrefix(x, "testtest")).toStrictEqual(x);
          }
        )
      ));
  });

  describe("stripSuffix", () => {
    it("strips arbitrary suffixes", () =>
      fc.assert(
        fc.property(fc.string(), fc.string(), (prefix, suffix) => {
          expect(stripSuffix(prefix + suffix, suffix)).toStrictEqual(prefix);
        })
      ));
    it("no conversions if suffix does not match", () =>
      fc.assert(
        fc.property(
          fc.string().filter(x => !x.endsWith("testtest")),
          x => {
            expect(stripSuffix(x, "testtest")).toStrictEqual(x);
          }
        )
      ));
  });
});
