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

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { track: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ favorites });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { trackId } = await req.json();
  if (!trackId) return NextResponse.json({ error: "trackId é obrigatório." }, { status: 400 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_trackId: { userId, trackId } },
    create: { userId, trackId },
    update: {},
  });
  return NextResponse.json({ favorite }, { status: 201 });
}

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { trackId } = await req.json();
  await prisma.favorite.deleteMany({ where: { userId, trackId } });
  return NextResponse.json({ ok: true });
}
