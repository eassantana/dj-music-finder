"use client";

import { SlidersHorizontal } from "lucide-react";

export interface Filters {
  genre?: string;
  year?: string;
  minBpm?: string;
  maxBpm?: string;
  key?: string;
}

const GENRES = ["House", "Techno", "Trance", "Drum and Bass", "Rock", "Música Eletrônica"];
const CAMELOT_KEYS = [
  "1A","2A","3A","4A","5A","6A","7A","8A","9A","10A","11A","12A",
  "1B","2B","3B","4B","5B","6B","7B","8B","9B","10B","11B","12B",
];

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  function set<K extends keyof Filters>(key: K, value: string) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className="rounded-xl2 border border-base-border bg-base-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-paper-soft/70">
        <SlidersHorizontal className="h-4 w-4" /> Filtros avançados
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <select
          value={filters.genre ?? ""}
          onChange={(e) => set("genre", e.target.value)}
          className="rounded-lg border border-base-border bg-base px-2 py-1.5 text-xs"
        >
          <option value="">Gênero</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={filters.key ?? ""}
          onChange={(e) => set("key", e.target.value)}
          className="rounded-lg border border-base-border bg-base px-2 py-1.5 text-xs font-mono"
        >
          <option value="">Tonalidade</option>
          {CAMELOT_KEYS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Ano"
          value={filters.year ?? ""}
          onChange={(e) => set("year", e.target.value)}
          className="rounded-lg border border-base-border bg-base px-2 py-1.5 text-xs"
        />

        <input
          type="number"
          placeholder="BPM mín."
          value={filters.minBpm ?? ""}
          onChange={(e) => set("minBpm", e.target.value)}
          className="rounded-lg border border-base-border bg-base px-2 py-1.5 text-xs font-mono"
        />

        <input
          type="number"
          placeholder="BPM máx."
          value={filters.maxBpm ?? ""}
          onChange={(e) => set("maxBpm", e.target.value)}
          className="rounded-lg border border-base-border bg-base px-2 py-1.5 text-xs font-mono"
        />

        <button
          onClick={() => onChange({})}
          className="rounded-lg border border-base-border px-2 py-1.5 text-xs hover:border-signal hover:text-signal"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
