"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DeletePlaylistButton } from "@/components/DeletePlaylistButton";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  _count?: {
    tracks: number;
  };
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Busca as playlists salvas
  async function loadPlaylists() {
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data);
      }
    } catch (error) {
      console.error("Erro ao carregar playlists:", error);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  // Cria uma nova playlist
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName("");
        loadPlaylists(); // Recarrega a lista
      }
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-paper">Minhas Playlists</h1>

      {/* Formulário de criar nova playlist */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da playlist"
          className="flex-1 rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm text-paper focus:outline-none focus:border-signal"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-base hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar"}
        </button>
      </form>

      {/* Listagem das playlists */}
      {playlists.length === 0 ? (
        <p className="text-sm text-paper-soft/50 py-8 text-center">
          Você ainda não criou nenhuma playlist.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between p-4 rounded-lg border border-base-border bg-base-surface hover:border-zinc-700 transition gap-4"
            >
              <div>
                <Link href={`/playlists/${p.id}`}>
                  <h3 className="font-semibold text-paper text-lg hover:underline truncate">
                    {p.name}
                  </h3>
                </Link>
                {p.description && (
                  <p className="text-xs text-paper-soft/60 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                )}
              </div>

              {/* Botão de excluir acoplado ao ID individual (p.id) */}
              <div className="flex justify-end pt-2 border-t border-base-border/50">
                <DeletePlaylistButton playlistId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}