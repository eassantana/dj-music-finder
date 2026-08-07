import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID da playlist é obrigatório" },
        { status: 400 }
      );
    }

    // Deleta a playlist e todas as faixas vinculadas a ela
    await prisma.playlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Playlist excluída com sucesso", ok: true });
  } catch (error: any) {
    console.error("ERRO AO EXCLUIR PLAYLIST:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir playlist" },
      { status: 500 }
    );
  }
}