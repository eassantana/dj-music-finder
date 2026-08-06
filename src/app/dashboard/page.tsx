"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, ListMusic, History, Search } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/favorites").then((r) => r.json()).then((d) => setFavorites(d.favorites ?? []));
    fetch("/api/playlists").then((r) => r.json()).then((d) => setPlaylists(d.playlists ?? []));
    fetch("/api/history").then((r) => r.json()).then((d) => setHistory(d.history ?? []));
  }, [status]);

  if (status !== "authenticated") return null;

  const stats = [
    { label: "Favoritos", value: favorites.length, icon: Heart },
    { label: "Playlists", value: playlists.length, icon: ListMusic },
    { label: "Buscas realizadas", value: history.length, icon: Search },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Olá, {session.user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-paper-soft/60">Seu painel de atividade no DJ Music Finder.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl2 border border-base-border bg-base-surface p-5">
            <s.icon className="mb-2 h-5 w-5 text-signal" />
            <p className="font-mono text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-paper-soft/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
          <History className="h-4 w-4" /> Histórico recente de pesquisas
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-paper-soft/50">Nenhuma busca registrada ainda.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-base-border rounded-xl2 border border-base-border bg-base-surface">
            {history.slice(0, 10).map((h) => (
              <li key={h.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span>{h.query}</span>
                <span className="text-xs text-paper-soft/40">
                  {new Date(h.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
