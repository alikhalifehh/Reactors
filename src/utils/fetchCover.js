export async function fetchGoogleCover(title) {
  try {
    const query = encodeURIComponent(title);
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) return null;

    const volume = data.items[0];
    const img =
      volume.volumeInfo?.imageLinks?.thumbnail ||
      volume.volumeInfo?.imageLinks?.smallThumbnail;

    return img || null;
  } catch (err) {
    console.error("Google cover fetch failed:", err);
    return null;
  }
}
