"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel, Filters } from "@/components/FilterPanel";
import { TrackCard } from "@/components/TrackCard";
import { Track } from "@/types/track";
import { Loader2, Disc3 } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function cleanFilters(f: Filters): Record<string, string> {
    return Object.fromEntries(
      Object.entries(f).filter(([, v]) => v !== undefined && v !== "")
    );
  }

  async function runSearch(q: string, f: Filters = filters) {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);
    try {
      const searchParams = new URLSearchParams({ q, ...cleanFilters(f) });
      const url = "/api/search?" + searchParams.toString();
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (error) {
      console.error("Erro na busca:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(track: Track) {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: track.id }),
      });
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex items-center gap-2 text-signal">
          <Disc3 className="h-8 w-8 animate-[spin_6s_linear_infinite]" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Encontre a próxima faixa do seu set
          </span>
        </div>
        <h1 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
          Busque por música, artista, BPM ou tonalidade — tudo num só lugar.
        </h1>
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={(q) => runSearch(q)} />
        </div>
      </section>

      <FilterPanel
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          if (query) runSearch(query, f);
        }}
      />

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-paper-soft/60">
          <Loader2 className="h-5 w-5 animate-spin" /> Buscando faixas...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="py-12 text-center text-paper-soft/50">
          Nenhuma faixa encontrada para &ldquo;{query}&rdquo;. Tente outro termo ou ajuste os filtros.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}