import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).id as string;
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { trackId, value } = await req.json();
  if (!trackId || !value || value < 1 || value > 5) {
    return NextResponse.json({ error: "trackId e value (1-5) são obrigatórios." }, { status: 400 });
  }

  const rating = await prisma.rating.upsert({
    where: { userId_trackId: { userId, trackId } },
    create: { userId, trackId, value },
    update: { value },
  });
  return NextResponse.json({ rating }, { status: 201 });
}
