export function getCachedCover(title) {
  const key = `cover_${title.toLowerCase()}`;
  return localStorage.getItem(key);
}

export function cacheCover(title, url) {
  const key = `cover_${title.toLowerCase()}`;
  if (url) {
    localStorage.setItem(key, url);
  }
}
