export function stripTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export function ellipsisText(input: string, maxLength = 50): string {
  return input.length > maxLength ? input.slice(0, maxLength) + "..." : input;
}

export function stripPrefix(input: string, prefix: string): string {
  return !prefix ? input : input.startsWith(prefix) ? input.slice(prefix.length) : input;
}

export function stripSuffix(input: string, suffix: string): string {
  return !suffix ? input : input.endsWith(suffix) ? input.slice(0, -suffix.length) : input;
}

export function isDefined<T>(value: T | undefined | null): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function requireEnv(name: string): string {
  return process.env[name] ?? throwException(() => new Error(`Environment Variable ${name} is not set`));
}

export function throwException(except: () => void): never {
  throw except();
}

export function intersperse<T>(values: T[], inner: T): T[] {
  return values.reduce((a, v, n) => (n > 0 ? [...a, inner, v] : [v]), [] as T[]);
}
