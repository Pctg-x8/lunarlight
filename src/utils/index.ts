export function stripTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export function ellipsisText(input: string, maxLength = 50): string {
  return input.length > maxLength ? input.slice(0, maxLength) + "..." : input;
}

export function stripPrefix(input: string, prefix: string): string {
  return input.startsWith(prefix) ? input.slice(prefix.length) : input;
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
