"use client";

import { useEffect, useState } from "react";
import { TrackCard } from "@/components/TrackCard";
import { Track } from "@/types/track";

const TABS = [
  { key: "trending", label: "Em alta" },
  { key: "recent", label: "Lançamentos recentes" },
  { key: "genre", label: "Por gênero" },
];

const GENRES = ["House", "Techno", "Trance", "Drum and Bass", "Rock", "Música Eletrônica"];

export default function RankingsPage() {
  const [tab, setTab] = useState("trending");
  const [genre, setGenre] = useState(GENRES[0]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ type: tab, ...(tab === "genre" ? { genre } : {}) });
    fetch(`/api/rankings?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setTracks(d.tracks ?? []))
      .finally(() => setLoading(false));
  }, [tab, genre]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Rankings</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              tab === t.key ? "border-signal bg-signal/10 text-signal" : "border-base-border text-paper-soft/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "genre" && (
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`rounded-full px-3 py-1 text-xs ${
                genre === g ? "bg-signal text-base" : "bg-base-surface text-paper-soft/60"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-paper-soft/50">Carregando...</p>
      ) : tracks.length === 0 ? (
        <p className="py-12 text-center text-paper-soft/50">
          Nada aqui ainda — faça algumas buscas para popular os rankings.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
