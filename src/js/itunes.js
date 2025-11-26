// simple iTunes search wrapper
export async function searchItunes(query, limit = 12) {
  const q = encodeURIComponent(query);
  const url = `https://itunes.apple.com/search?term=${q}&media=music&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('iTunes search failed');
  const data = await res.json();
  // return relevant fields
  return (data.results || []).map(r => ({
    trackId: r.trackId || null,
    trackName: r.trackName || r.collectionName || '',
    artistName: r.artistName || '',
    artworkUrl100: r.artworkUrl100 || '',
    collectionName: r.collectionName || ''
  }));
}
