import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).id as string;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const playlist = await prisma.playlist.findUnique({
    where: { id: params.id },
    include: { tracks: { include: { track: true }, orderBy: { position: "asc" } } },
  });
  if (!playlist) return NextResponse.json({ error: "Playlist não encontrada." }, { status: 404 });
  return NextResponse.json({ playlist });
}

// Adiciona uma faixa à playlist: POST { trackId }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
  if (!playlist || playlist.userId !== userId) {
    return NextResponse.json({ error: "Playlist não encontrada." }, { status: 404 });
  }

  const { trackId } = await req.json();
  const count = await prisma.playlistTrack.count({ where: { playlistId: params.id } });

  const entry = await prisma.playlistTrack.upsert({
    where: { playlistId_trackId: { playlistId: params.id, trackId } },
    create: { playlistId: params.id, trackId, position: count },
    update: {},
  });
  return NextResponse.json({ entry }, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
  if (!playlist || playlist.userId !== userId) {
    return NextResponse.json({ error: "Playlist não encontrada." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (body?.trackId) {
    // remove só uma faixa
    await prisma.playlistTrack.deleteMany({ where: { playlistId: params.id, trackId: body.trackId } });
    return NextResponse.json({ ok: true });
  }

  // remove a playlist inteira
  await prisma.playlist.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
