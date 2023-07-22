import ExtensibleCustomError from "extensible-custom-error";
import { MaybeLazy, evaluateMaybeLazy } from "./lazy";

export class DescribedError extends ExtensibleCustomError {}

export function rethrowWithDescription(desc: MaybeLazy<string>): (e: Error) => never {
  return e => {
    throw new DescribedError(evaluateMaybeLazy(desc), e);
  };
}
