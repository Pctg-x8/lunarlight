import { describe, expect, it } from "@jest/globals";
import * as fc from "fast-check";
import Webfinger from "./webfinger";

const userName = fc.stringOf(
  fc.char().filter((x) => x != "@"),
  { minLength: 1 }
);
const domainName = fc.string({ minLength: 1 });
const CorrectWebfingerAddressPattern = userName.chain((x) =>
  fc.option(
    domainName.map((d) => `${x}@${d}`),
    { nil: x }
  )
);

describe("Address", () => {
  it("decomposes local address", () =>
    fc.assert(
      fc.property(userName, (username) => {
        expect(Webfinger.Address.decompose(`@${username}`)).toStrictEqual(new Webfinger.LocalAddress(username));
        expect(Webfinger.Address.decompose(username)).toStrictEqual(new Webfinger.LocalAddress(username));
      })
    ));
  it("decomposes remote address", () =>
    fc.assert(
      fc.property(userName, domainName, (u, d) => {
        expect(Webfinger.Address.decompose(`@${u}@${d}`)).toStrictEqual(new Webfinger.RemoteAddress(u, d));
        expect(Webfinger.Address.decompose(`${u}@${d}`)).toStrictEqual(new Webfinger.RemoteAddress(u, d));
      })
    ));

  it("stringify", () => {
    fc.assert(
      fc.property(CorrectWebfingerAddressPattern, (u) => {
        expect(Webfinger.Address.decompose(`@${u}`).toString()).toStrictEqual(u);
        expect(Webfinger.Address.decompose(u).toString()).toStrictEqual(u);
      })
    );
  });
});
