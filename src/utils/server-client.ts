export function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * evaluate values by side
 */
export function alterCS<R>(clientValue: () => R, serverValue: () => R): R {
  return isServer() ? serverValue() : clientValue();
}
