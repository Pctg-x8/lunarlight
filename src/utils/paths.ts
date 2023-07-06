export function appBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "/";
}
