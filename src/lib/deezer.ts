// Integração com a API pública do Deezer — não exige API key.
// Docs: https://developers.deezer.com/api

const API_BASE = "https://api.deezer.com";

export interface DeezerTrackResult {
  deezerId: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string | null;
  durationMs: number;
  previewUrl: string | null;
  externalUrl: string;
}

export async function searchDeezerTracks(query: string, limit = 20): Promise<DeezerTrackResult[]> {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Deezer API error ${res.status}`);
  const data = await res.json();

  return (data.data ?? []).map((t: any) => ({
    deezerId: String(t.id),
    title: t.title,
    artist: t.artist.name,
    album: t.album.title,
    coverUrl: t.album.cover_medium ?? null,
    durationMs: t.duration * 1000,
    previewUrl: t.preview ?? null,
    externalUrl: t.link,
  }));
}
