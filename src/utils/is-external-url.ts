/**
 * Returns true if the URL points to an external resource
 * (has a host different from the current origin or is an absolute URL).
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false

  // Anchors and relative paths are always internal
  if (url.startsWith('#') || url.startsWith('/') || url.startsWith('.')) {
    return false
  }

  // mailto:, tel:, etc. are not navigation links
  if (/^[a-z][a-z\d+\-.]*:/i.test(url) && !url.startsWith('http')) {
    return false
  }

  try {
    const parsed = new URL(url)
    if (typeof window === 'undefined') return true
    return parsed.host !== window.location.host
  } catch {
    return false
  }
}
