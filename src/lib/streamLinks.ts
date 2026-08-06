// Monta o objeto de links por serviço para uma faixa.
// Spotify e Deezer têm link direto (vêm da própria API).
// Os demais (YouTube Music, Apple Music, SoundCloud, Beatport, Bandcamp, Traxsource)
// não têm API de busca pública gratuita simples, então geramos um link de busca —
// suficiente para o usuário abrir o serviço já com o resultado. Trocar por API oficial
// de cada parceiro quando/se a chave de acesso estiver disponível.

export interface StreamLinks {
  spotify?: string;
  youtubeMusic?: string;
  appleMusic?: string;
  deezer?: string;
  soundcloud?: string;
  beatport?: string;
  bandcamp?: string;
  traxsource?: string;
}

export function buildStreamLinks(params: {
  title: string;
  artist: string;
  spotifyUrl?: string | null;
  deezerUrl?: string | null;
}): StreamLinks {
  const q = encodeURIComponent(`${params.artist} ${params.title}`);
  return {
    spotify: params.spotifyUrl ?? undefined,
    deezer: params.deezerUrl ?? undefined,
    youtubeMusic: `https://music.youtube.com/search?q=${q}`,
    appleMusic: `https://music.apple.com/search?term=${q}`,
    soundcloud: `https://soundcloud.com/search?q=${q}`,
    beatport: `https://www.beatport.com/search?q=${q}`,
    bandcamp: `https://bandcamp.com/search?q=${q}`,
    traxsource: `https://www.traxsource.com/search?term=${q}`,
  };
}
