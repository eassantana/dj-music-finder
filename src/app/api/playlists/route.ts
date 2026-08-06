import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).id as string;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const playlists = await prisma.playlist.findMany({
    where: { userId },
    include: { tracks: { include: { track: true }, orderBy: { position: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ playlists });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { name, description, isPublic } = await req.json();
  if (!name) return NextResponse.json({ error: "name é obrigatório." }, { status: 400 });

  const playlist = await prisma.playlist.create({
    data: { userId, name, description, isPublic: !!isPublic },
  });
  return NextResponse.json({ playlist }, { status: 201 });
}
