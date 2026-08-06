import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchSpotifyTracks, getAudioFeatures } from "@/lib/spotify";
import { searchDeezerTracks } from "@/lib/deezer";
import { buildStreamLinks } from "@/lib/streamLinks";

// GET /api/search?q=daft+punk&genre=house&minBpm=120&maxBpm=128&year=2013
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Parâmetro 'q' é obrigatório." }, { status: 400 });

  const genre = searchParams.get("genre") ?? undefined;
  const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
  const minBpm = searchParams.get("minBpm") ? Number(searchParams.get("minBpm")) : undefined;
  const maxBpm = searchParams.get("maxBpm") ? Number(searchParams.get("maxBpm")) : undefined;
  const key = searchParams.get("key") ?? undefined;

  // Busca em paralelo nas duas fontes; cada uma falha isoladamente sem derrubar a busca inteira.
  const [spotifyResults, deezerResults] = await Promise.all([
    searchSpotifyTracks(q).catch(() => []),
    searchDeezerTracks(q).catch(() => []),
  ]);

  // Junta por título+artista (normalizado) para casar a mesma faixa vinda de fontes diferentes.
  const merged = new Map<string, any>();
  const normKey = (title: string, artist: string) =>
    `${title.toLowerCase().trim()}::${artist.toLowerCase().trim()}`;

  for (const s of spotifyResults) {
    merged.set(normKey(s.title, s.artist), {
      title: s.title,
      artist: s.artist,
      album: s.album,
      year: s.releaseYear,
      coverUrl: s.coverUrl,
      durationMs: s.durationMs,
      popularity: s.popularity,
      previewUrl: s.previewUrl,
      spotifyId: s.spotifyId,
      spotifyUrl: s.externalUrl,
    });
  }
  for (const d of deezerResults) {
    const k = normKey(d.title, d.artist);
    const existing = merged.get(k) ?? {};
    merged.set(k, {
      ...existing,
      title: existing.title ?? d.title,
      artist: existing.artist ?? d.artist,
      album: existing.album ?? d.album,
      coverUrl: existing.coverUrl ?? d.coverUrl,
      durationMs: existing.durationMs ?? d.durationMs,
      previewUrl: existing.previewUrl ?? d.previewUrl,
      deezerId: d.deezerId,
      deezerUrl: d.externalUrl,
    });
  }

  // Enriquece com BPM/tonalidade (audio-features) só para os que têm spotifyId — limita a 10
  // chamadas extras por busca para não estourar rate limit.
  const items = Array.from(merged.values());
  await Promise.all(
    items.slice(0, 10).map(async (item) => {
      if (!item.spotifyId) return;
      try {
        const features = await getAudioFeatures(item.spotifyId);
        item.bpm = features.bpm;
        item.key = features.key;
      } catch {
        // segue sem BPM/tonalidade se a chamada falhar
      }
    })
  );

  let results = items.map((item) => ({
    ...item,
    genre: genre ?? null,
    streamLinks: buildStreamLinks({
      title: item.title,
      artist: item.artist,
      spotifyUrl: item.spotifyUrl,
      deezerUrl: item.deezerUrl,
    }),
  }));

  // Filtros aplicados em memória sobre o resultado combinado
  if (year) results = results.filter((r) => r.year === year);
  if (minBpm) results = results.filter((r) => r.bpm && r.bpm >= minBpm);
  if (maxBpm) results = results.filter((r) => r.bpm && r.bpm <= maxBpm);
  if (key) results = results.filter((r) => r.key === key);

  // Cacheia as faixas no banco (upsert por spotifyId/deezerId) para permitir favoritar/anotar depois.
  const saved = await Promise.all(
    results.map((r) =>
      prisma.track.upsert({
        where: r.spotifyId ? { spotifyId: r.spotifyId } : { deezerId: r.deezerId ?? "" },
        create: {
          title: r.title,
          artist: r.artist,
          album: r.album,
          year: r.year,
          genre: r.genre,
          coverUrl: r.coverUrl,
          durationMs: r.durationMs,
          bpm: r.bpm,
          key: r.key,
          popularity: r.popularity,
          previewUrl: r.previewUrl,
          spotifyId: r.spotifyId,
          deezerId: r.deezerId,
          streamLinks: r.streamLinks,
        },
        update: {
          coverUrl: r.coverUrl,
          bpm: r.bpm,
          key: r.key,
          popularity: r.popularity,
          previewUrl: r.previewUrl,
          streamLinks: r.streamLinks,
        },
      })
    )
  ).catch(() => null); // se o banco não estiver configurado ainda, a busca ainda funciona sem cache

  const session = await getServerSession(authOptions);
  if (session?.user) {
    await prisma.searchHistory
      .create({
        data: {
          userId: (session.user as any).id,
          query: q,
          filters: { genre, year, minBpm, maxBpm, key },
        },
      })
      .catch(() => null);
  }

  return NextResponse.json({ results: saved ?? results });
}
