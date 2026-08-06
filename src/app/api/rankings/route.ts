import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/rankings?type=trending|recent|genre&genre=house
// Os rankings usam o cache local (tabela Track) alimentado pelas buscas — em produção,
// trocar por chamadas diretas aos endpoints de "charts" do Spotify/Deezer por região.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "trending";
  const genre = searchParams.get("genre") ?? undefined;

  if (type === "recent") {
    const tracks = await prisma.track.findMany({
      where: genre ? { genre } : undefined,
      orderBy: { year: "desc" },
      take: 30,
    });
    return NextResponse.json({ tracks });
  }

  if (type === "genre" && genre) {
    const tracks = await prisma.track.findMany({
      where: { genre },
      orderBy: { popularity: "desc" },
      take: 30,
    });
    return NextResponse.json({ tracks });
  }

  // trending = mais populares do cache
  const tracks = await prisma.track.findMany({
    orderBy: { popularity: "desc" },
    take: 30,
  });
  return NextResponse.json({ tracks });
}
