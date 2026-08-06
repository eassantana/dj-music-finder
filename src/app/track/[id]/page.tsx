"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Star, Music2 } from "lucide-react";
import { formatDuration } from "@/types/track";

const SERVICE_LABELS: Record<string, string> = {
  spotify: "Spotify",
  youtubeMusic: "YouTube Music",
  appleMusic: "Apple Music",
  deezer: "Deezer",
  soundcloud: "SoundCloud",
  beatport: "Beatport",
  bandcamp: "Bandcamp",
  traxsource: "Traxsource",
};

export default function TrackDetailPage({ params }: { params: { id: string } }) {
  const [track, setTrack] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState("");
  const [rating, setRating] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
    fetch(`/api/tracks/${params.id}`)
      .then((r) => r.json())
      .then((d) => setTrack(d.track ?? null))
      .catch(() => {});
    fetch(`/api/notes?trackId=${params.id}`)
      .then((r) => r.json())
      .then((d) => setNotes(d.notes ?? []))
      .catch(() => {});
  }, [params.id]);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId: params.id, content: noteText }),
    });
    if (res.ok) {
      const { note } = await res.json();
      setNotes((prev) => [note, ...prev]);
      setNoteText("");
    }
  }

  async function rate(value: number) {
    setRating(value);
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId: params.id, value }),
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2 flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl2 bg-base-surface">
            {track?.coverUrl ? (
              <Image src={track.coverUrl} alt="" fill className="object-cover" />
            ) : (
              <Music2 className="m-auto mt-10 h-10 w-10 text-paper-soft/30" />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">{track?.title ?? "Faixa"}</h1>
            <p className="text-paper-soft/60">{track?.artist}</p>
            {track && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {track.bpm && <span className="bpm-badge">{Math.round(track.bpm)} BPM</span>}
                {track.key && <span className="key-badge">{track.key}</span>}
                <span className="key-badge">{formatDuration(track.durationMs)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => rate(n)} aria-label={`Avaliar com ${n} estrelas`}>
              <Star className={`h-5 w-5 ${n <= rating ? "fill-signal text-signal" : "text-paper-soft/30"}`} />
            </button>
          ))}
        </div>

        {track?.streamLinks && (
          <div>
            <h2 className="mb-2 font-display font-semibold">Disponível em</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(track.streamLinks)
                .filter(([, url]) => url)
                .map(([service, url]) => (
                  <a
                    key={service}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-base-border px-3 py-1.5 text-xs hover:border-signal hover:text-signal"
                  >
                    {SERVICE_LABELS[service] ?? service}
                  </a>
                ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-2 font-display font-semibold">Anotações</h2>
          <form onSubmit={addNote} className="mb-3 flex gap-2">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Ex: entra bem depois de faixas em 8A, subir em transição longa..."
              className="flex-1 rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg bg-signal px-3 text-sm font-medium text-base">
              Salvar
            </button>
          </form>
          <ul className="flex flex-col gap-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg border border-base-border bg-base-surface p-3 text-sm">
                {n.content}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl2 border border-base-border bg-base-surface p-6">
        <p className="text-xs uppercase tracking-widest text-paper-soft/50">Compartilhar</p>
        {shareUrl && <QRCodeSVG value={shareUrl} size={160} bgColor="transparent" fgColor="#E8A33D" />}
        <p className="break-all text-center text-[10px] text-paper-soft/40">{shareUrl}</p>
      </div>
    </div>
  );
}
