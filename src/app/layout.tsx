import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DJ Music Finder",
  description:
    "Encontre, organize e acesse faixas para seus sets: BPM, tonalidade, popularidade e onde ouvir em cada serviço de streaming.",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0F0E13",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
