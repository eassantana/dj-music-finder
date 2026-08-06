"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ListMusic } from "lucide-react";

export default function PlaylistsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  function load() {
    fetch("/api/playlists").then((r) => r.json()).then((d) => setPlaylists(d.playlists ?? []));
  }

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  async function createPlaylist(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    setCreating(false);
    load();
  }

  if (status !== "authenticated") return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Minhas playlists</h1>
        <button
          onClick={() => setCreating((c) => !c)}
          className="flex items-center gap-1.5 rounded-full bg-signal px-3 py-1.5 text-sm font-medium text-base"
        >
          <Plus className="h-4 w-4" /> Nova playlist
        </button>
      </div>

      {creating && (
        <form onSubmit={createPlaylist} className="flex gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da playlist"
            className="flex-1 rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-signal px-4 text-sm font-medium text-base">
            Criar
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="text-sm text-paper-soft/50">Você ainda não criou nenhuma playlist.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {playlists.map((p) => (
            <Link
              key={p.id}
              href={`/playlists/${p.id}`}
              className="flex flex-col gap-2 rounded-xl2 border border-base-border bg-base-surface p-4 hover:border-signal"
            >
              <ListMusic className="h-6 w-6 text-signal" />
              <p className="font-display font-semibold">{p.name}</p>
              <p className="text-xs text-paper-soft/50">{p.tracks?.length ?? 0} faixas</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
