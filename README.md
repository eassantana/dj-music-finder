# DJ Music Finder 🎧

Plataforma fullstack para DJs, produtores e amantes de música pesquisarem faixas
por nome, artista, álbum, gênero ou ano, com BPM, tonalidade (Camelot), popularidade,
prévias e links diretos para Spotify, YouTube Music, Apple Music, Deezer, SoundCloud,
Beatport, Bandcamp e Traxsource. Inclui contas de usuário, favoritos, playlists,
anotações por faixa, avaliações, histórico de buscas, rankings, dashboard, tema
claro/escuro, pesquisa por voz, compartilhamento via QR Code e suporte a PWA.

## Stack

- **Next.js 14** (App Router) — front-end e back-end no mesmo projeto
- **TypeScript**
- **Tailwind CSS** — design system próprio (ver `tailwind.config.ts`)
- **Prisma + PostgreSQL** — banco de dados
- **NextAuth** (Credentials) — autenticação por email/senha
- **Spotify Web API** (Client Credentials) — busca, capa, popularidade, BPM/tonalidade
- **Deezer API pública** — busca e prévias complementares
- **next-pwa** — app instalável, funciona offline para o shell da aplicação

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# preencha DATABASE_URL, NEXTAUTH_SECRET e as credenciais do Spotify
# (crie um app em https://developer.spotify.com/dashboard — é grátis)

# 3. Criar as tabelas no banco
npx prisma migrate dev --name init

# 4. Rodar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000.

## Estrutura do projeto

```
src/
  app/
    page.tsx                → busca principal
    rankings/                → em alta, lançamentos, por gênero
    dashboard/                → estatísticas do usuário
    playlists/                → lista e detalhe de playlists
    track/[id]/                → detalhe da faixa + QR Code + anotações
    (auth)/login, register/    → autenticação
    api/
      search/                → busca combinada Spotify + Deezer com filtros
      favorites/                → CRUD de favoritos
      playlists/                → CRUD de playlists e faixas
      notes/, ratings/                → anotações e avaliações por faixa
      rankings/                → em alta / recentes / por gênero
      history/                → histórico de buscas
      auth/[...nextauth]/, register/ → autenticação
  components/                → Navbar, SearchBar (com voz), FilterPanel, TrackCard, ThemeProvider
  lib/                → prisma, spotify.ts, deezer.ts, streamLinks.ts, auth.ts
prisma/schema.prisma  → User, Track, Favorite, Playlist, PlaylistTrack, Note, Rating, SearchHistory
```

## Decisões e próximos passos

- **Links de streaming**: Spotify e Deezer usam link direto retornado pela própria API.
  Os demais serviços (YouTube Music, Apple Music, SoundCloud, Beatport, Bandcamp,
  Traxsource) não têm API pública de busca simples, então por enquanto geram um link
  de busca pronto (`src/lib/streamLinks.ts`). Trocar por API oficial de cada parceiro
  conforme as chaves forem disponibilizadas.
- **Cache de faixas**: toda busca grava/atualiza as faixas na tabela `Track`, o que
  alimenta os rankings e permite favoritar/anotar/avaliar sem depender da API externa
  estar sempre disponível.
- **BPM/tonalidade**: vêm do endpoint `audio-features` do Spotify (limitado às 10
  primeiras faixas por busca para não estourar rate limit — ajustável em
  `src/app/api/search/route.ts`).
- **Ícones do PWA**: `public/icons/icon.svg` é um placeholder — gere os PNGs
  192x192 e 512x512 (ex. via https://realfavicongenerator.net) e salve como
  `public/icons/icon-192.png` e `icon-512.png`.
- **Pendente para produção**: rate limiting nas rotas de API, paginação nos
  resultados de busca, testes automatizados, e troca do Credentials Provider por
  OAuth (Google) se desejar login social.
