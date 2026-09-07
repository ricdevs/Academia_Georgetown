const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** Prefix a site-root path with Astro `base` (needed for GitHub project Pages). */
export function withBase(path: string): string {
  if (!path || ABSOLUTE.test(path) || path.startsWith('#') || path.startsWith('?')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const suffix = path.startsWith('/') ? path.slice(1) : path;
  return `${prefix}${suffix}`;
}

/** Strip Astro `base` so path comparisons stay root-relative (`/contacto/`). */
export function stripBase(pathname: string): string {
  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.replace(/\/+$/, '');
  let path = pathname;
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/';
  }
  if (!path.startsWith('/')) path = `/${path}`;
  return path;
}

export const isPagesPreview = () => (import.meta.env.BASE_URL || '/') !== '/';
