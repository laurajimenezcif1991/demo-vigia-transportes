/**
 * Returns the correct URL for a public-folder asset, respecting the Vite base path.
 * Use instead of bare "/logo-vigia.png" strings in JSX/TS code.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
