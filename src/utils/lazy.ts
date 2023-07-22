export type Lazy<T> = () => T;
export type MaybeLazy<T> = T | Lazy<T>;

export function needsLazyEvaluation<T>(value: MaybeLazy<T>): value is Lazy<T> {
  return value instanceof Function;
}
export function evaluateMaybeLazy<T>(value: MaybeLazy<T>): T {
  return needsLazyEvaluation(value) ? value() : value;
}
