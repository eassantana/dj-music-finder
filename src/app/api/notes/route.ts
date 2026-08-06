import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).id as string;
}

// GET /api/notes?trackId=xxx
export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const trackId = new URL(req.url).searchParams.get("trackId");
  const notes = await prisma.note.findMany({
    where: { userId, ...(trackId ? { trackId } : {}) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { trackId, content } = await req.json();
  if (!trackId || !content) {
    return NextResponse.json({ error: "trackId e content são obrigatórios." }, { status: 400 });
  }

  const note = await prisma.note.create({ data: { userId, trackId, content } });
  return NextResponse.json({ note }, { status: 201 });
}
