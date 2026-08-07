"use client";

import { useRouter } from "next/navigation";

export function DeletePlaylistButton({ playlistId }: { playlistId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Tem certeza que deseja excluir esta playlist?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Playlist excluída com sucesso!");
        router.refresh(); // Atualiza a página para a playlist sumir da tela
      } else {
        alert("Falha ao excluir a playlist.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-md text-sm transition"
    >
      Excluir Playlist
    </button>
  );
}