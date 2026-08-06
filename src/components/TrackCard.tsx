"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Music2, PlusCircle } from "lucide-react";
import { Track, formatDuration } from "@/types/track";

const SERVICE_LABELS: Record<string, string> = {
  spotify: "Spotify",
  youtubeMusic: "YT Music",
  appleMusic: "Apple Music",
  deezer: "Deezer",
  soundcloud: "SoundCloud",
  beatport: "Beatport",
  bandcamp: "Bandcamp",
  traxsource: "Traxsource",
};

export function TrackCard({
  track,
  isFavorite = false,
  onToggleFavorite,
  onAddToPlaylist,
}: {
  track: Track;
  isFavorite?: boolean;
  onToggleFavorite?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
}) {
  const [fav, setFav] = useState(isFavorite);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl2 border border-base-border bg-base-surface transition hover:border-signal/60">
      <Link href={`/track/${track.id}`} className="relative aspect-square w-full overflow-hidden bg-base">
        {track.coverUrl ? (
          <Image src={track.coverUrl} alt={`Capa de ${track.title}`} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-paper-soft/30">
            <Music2 className="h-10 w-10" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <Link href={`/track/${track.id}`} className="line-clamp-1 font-display text-sm font-semibold hover:text-signal">
            {track.title}
          </Link>
          <p className="line-clamp-1 text-xs text-paper-soft/60">{track.artist}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {track.bpm && <span className="bpm-badge">{Math.round(track.bpm)} BPM</span>}
          {track.key && <span className="key-badge">{track.key}</span>}
          <span className="key-badge">{formatDuration(track.durationMs)}</span>
          {typeof track.popularity === "number" && (
            <span className="key-badge">★ {track.popularity}</span>
          )}
        </div>

        {track.streamLinks && (
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-paper-soft/50">
            {Object.entries(track.streamLinks)
              .filter(([, url]) => url)
              .slice(0, 4)
              .map(([service, url]) => (
                <a
                  key={service}
                  href={url as string}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-base-border px-1.5 py-0.5 hover:border-signal hover:text-signal"
                >
                  {SERVICE_LABELS[service] ?? service}
                </a>
              ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setFav((f) => !f);
              onToggleFavorite?.(track);
            }}
            aria-label="Favoritar"
            className="rounded-full p-1.5 hover:bg-base-border"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-signal text-signal" : "text-paper-soft/50"}`} />
          </button>
          <button
            onClick={() => onAddToPlaylist?.(track)}
            aria-label="Adicionar à playlist"
            className="rounded-full p-1.5 hover:bg-base-border"
          >
            <PlusCircle className="h-4 w-4 text-paper-soft/50 hover:text-signal" />
          </button>
        </div>
      </div>
    </div>
  );
}
