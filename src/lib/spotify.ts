// Integração com a Web API do Spotify usando o fluxo Client Credentials.
// Requer SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET no .env (crie um app em
// https://developer.spotify.com/dashboard).
//
// Este fluxo só dá acesso a dados públicos (busca, faixas, audio-features),
// suficiente para o DJ Music Finder — não é necessário login do usuário no Spotify.

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET não configurados no .env");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Falha ao obter token do Spotify: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

async function spotifyFetch(path: string) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Spotify API error ${res.status} em ${path}`);
  return res.json();
}

// Camelot Wheel: converte key (0-11) + mode (0=menor,1=maior) do Spotify em notação usada por DJs.
const CAMELOT_MAJOR = ["8B", "3B", "10B", "5B", "12B", "7B", "2B", "9B", "4B", "11B", "6B", "1B"];
const CAMELOT_MINOR = ["5A", "12A", "7A", "2A", "9A", "4A", "11A", "6A", "1A", "8A", "3A", "10A"];

export function toCamelotKey(key: number, mode: number): string | null {
  if (key < 0) return null;
  return mode === 1 ? CAMELOT_MAJOR[key] : CAMELOT_MINOR[key];
}

export interface SpotifyTrackResult {
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string | null;
  durationMs: number;
  popularity: number;
  previewUrl: string | null;
  releaseYear: number | null;
  externalUrl: string;
}

export async function searchSpotifyTracks(query: string, limit = 20): Promise<SpotifyTrackResult[]> {
  const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
  return data.tracks.items.map((t: any) => ({
    spotifyId: t.id,
    title: t.name,
    artist: t.artists.map((a: any) => a.name).join(", "),
    album: t.album.name,
    coverUrl: t.album.images?.[0]?.url ?? null,
    durationMs: t.duration_ms,
    popularity: t.popularity,
    previewUrl: t.preview_url,
    releaseYear: t.album.release_date ? parseInt(t.album.release_date.slice(0, 4)) : null,
    externalUrl: t.external_urls.spotify,
  }));
}

// BPM e tonalidade vêm do endpoint audio-features, por isso é uma chamada separada.
export async function getAudioFeatures(spotifyId: string) {
  const data = await spotifyFetch(`/audio-features/${spotifyId}`);
  return {
    bpm: data.tempo as number,
    key: toCamelotKey(data.key, data.mode),
    durationMs: data.duration_ms as number,
  };
}
