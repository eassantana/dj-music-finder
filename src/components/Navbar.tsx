"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Disc3, Sun, Moon, LayoutDashboard, ListMusic, Search } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base/90 backdrop-blur html-light:bg-paper/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Disc3 className="h-6 w-6 text-signal" strokeWidth={1.75} />
          DJ Music Finder
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-paper-soft/70 md:flex">
          <Link href="/" className="flex items-center gap-1.5 hover:text-signal">
            <Search className="h-4 w-4" /> Buscar
          </Link>
          <Link href="/rankings" className="hover:text-signal">
            Rankings
          </Link>
          {session && (
            <>
              <Link href="/playlists" className="flex items-center gap-1.5 hover:text-signal">
                <ListMusic className="h-4 w-4" /> Playlists
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-signal">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Alternar tema"
            className="rounded-full border border-base-border p-2 hover:border-signal"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {session ? (
            <button
              onClick={() => signOut()}
              className="rounded-full bg-base-surface px-3 py-1.5 text-sm font-medium hover:bg-base-border"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-signal px-3 py-1.5 text-sm font-medium text-base hover:bg-signal-bright"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
