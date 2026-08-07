"use client";

import { Track } from "@/types/track";
import { Heart } from "lucide-react";
import { useState } from "react";

interface TrackCardProps {
  track: Track;
  onToggleFavorite?: (track: Track) => void;
}

export function TrackCard({ track, onToggleFavorite }: TrackCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const audioSource = track.previewUrl || (track as any).audioUrl;

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(track);
    }
  };

  return (
    <div className="flex flex-col justify-between p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
      <div>
        {/* Capa do Álbum */}
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full aspect-square object-cover rounded-lg mb-3"
          />
        ) : (
          <div className="w-full aspect-square bg-zinc-800 rounded-lg mb-3 flex items-center justify-center text-zinc-500 text-xs">
            Sem capa
          </div>
        )}

        {/* Informações da Música */}
        <div className="flex items-start justify-between gap-2">
          <div className="overflow-hidden">
            <h3 className="font-bold text-white text-sm truncate" title={track.title}>
              {track.title}
            </h3>
            <p className="text-xs text-zinc-400 truncate" title={track.artist}>
              {track.artist}
            </p>
          </div>

          {/* Botão de Favoritar */}
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="p-1 text-zinc-400 hover:text-red-500 transition"
              title="Favoritar"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* BPM e Tonalidade (Key) */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400 font-mono">
          {track.bpm && <span>{track.bpm} BPM</span>}
          {track.key && (
            <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
              {track.key}
            </span>
          )}
        </div>
      </div>

      {/* Player de Áudio para Tocar no Site */}
      <div className="mt-3">
        {audioSource ? (
          <audio controls className="w-full h-8 rounded accent-signal">
            <source src={audioSource} type="audio/mpeg" />
            Seu navegador não suporta o tocador de áudio.
          </audio>
        ) : (
          <p className="text-[10px] text-zinc-600 text-center italic">
            Sem prévia de áudio
          </p>
        )}
      </div>
    </div>
  );
}