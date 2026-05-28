// Resolves a public-folder path against Vite's base URL so that images work
// both locally (base = "/") and on GitHub Pages (base = "/hxhdle/").
// Paths in characters.json start with "/"; we strip that before joining.
export function assetUrl(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "")
}
