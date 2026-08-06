"use client";

import { useEffect, useState } from "react";
import { TrackCard } from "@/components/TrackCard";

export default function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const [playlist, setPlaylist] = useState<any>(null);

  function load() {
    fetch(`/api/playlists/${params.id}`).then((r) => r.json()).then((d) => setPlaylist(d.playlist));
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function removeTrack(trackId: string) {
    await fetch(`/api/playlists/${params.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId }),
    });
    load();
  }

  if (!playlist) return <p className="text-paper-soft/50">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{playlist.name}</h1>
        {playlist.description && <p className="text-sm text-paper-soft/60">{playlist.description}</p>}
        <p className="text-xs text-paper-soft/40">{playlist.tracks.length} faixas</p>
      </div>

      {playlist.tracks.length === 0 ? (
        <p className="text-sm text-paper-soft/50">
          Nenhuma faixa nesta playlist ainda. Busque músicas e use &ldquo;Adicionar à playlist&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {playlist.tracks.map((pt: any) => (
            <div key={pt.id} className="relative">
              <TrackCard track={pt.track} />
              <button
                onClick={() => removeTrack(pt.track.id)}
                className="absolute right-2 top-2 rounded-full bg-base/80 px-2 py-1 text-[10px] hover:bg-red-500/80"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
