import { afterAll, describe, expect, it, jest } from "@jest/globals";
import * as fc from "fast-check";
import { beforeEach } from "node:test";
import { realPath } from "./paths";

const NonAbsPath = fc
  .char()
  .filter(x => x != "/")
  .chain(c => fc.string().map(x => c + x));
const NonSlashTerminatedAppBasePath = fc
  .string()
  .map(x => `/${x}`)
  .filter(x => !x.endsWith("/"));

jest.mock("@/utils/server-client", () => ({
  alterCS: <R>(c: () => R, _s: () => R) => c(),
}));

describe("realPath", () => {
  // process.env mockup https://stackoverflow.com/a/48042799
  const OriginalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    // Note: よくわからないがstructuredCloneは使えないらしい
    process.env = { ...OriginalEnv };
  });

  afterAll(() => {
    process.env = OriginalEnv;
  });

  it("converts special root onto app base path", () => {
    // @ts-ignore
    delete process.env.NEXT_PUBLIC_BASE_PATH;

    expect(realPath("/")).toStrictEqual("/");

    fc.assert(
      fc.property(NonSlashTerminatedAppBasePath, abp => {
        // @ts-ignore
        process.env.NEXT_PUBLIC_BASE_PATH = abp;

        expect(realPath("/")).toStrictEqual(abp);
      })
    );
  });
  it("converts onto app base path", () =>
    fc.assert(
      fc.property(NonAbsPath, NonSlashTerminatedAppBasePath, (vap, abp) => {
        // @ts-ignore
        process.env.NEXT_PUBLIC_BASE_PATH = abp;

        expect(realPath(vap)).toStrictEqual(`${abp}/${vap}`);
        expect(realPath("/" + vap)).toStrictEqual(`${abp}/${vap}`);
      })
    ));
  it("converts onto *malformed* app base path", () =>
    fc.assert(
      fc.property(NonAbsPath, NonSlashTerminatedAppBasePath, (vap, abp) => {
        // @ts-ignore
        process.env.NEXT_PUBLIC_BASE_PATH = abp + "/";

        expect(realPath(vap)).toStrictEqual(`${abp}/${vap}`);
        expect(realPath("/" + vap)).toStrictEqual(`${abp}/${vap}`);
      })
    ));
  it("force generating root abs path if no base path specified", () =>
    fc.assert(
      fc.property(NonAbsPath, vap => {
        // @ts-ignore
        delete process.env.NEXT_PUBLIC_BASE_PATH;

        expect(realPath(vap)).toStrictEqual("/" + vap);
        expect(realPath("/" + vap)).toStrictEqual("/" + vap);
      })
    ));
});
