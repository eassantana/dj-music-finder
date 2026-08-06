export interface StreamLinks {
  spotify?: string;
  youtubeMusic?: string;
  appleMusic?: string;
  deezer?: string;
  soundcloud?: string;
  beatport?: string;
  bandcamp?: string;
  traxsource?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  year?: number | null;
  genre?: string | null;
  coverUrl?: string | null;
  durationMs?: number | null;
  bpm?: number | null;
  key?: string | null;
  popularity?: number | null;
  previewUrl?: string | null;
  streamLinks?: StreamLinks | null;
}

export function formatDuration(ms?: number | null): string {
  if (!ms) return "--:--";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
