"use client";

import { useState, useRef } from "react";
import { Search, Mic } from "lucide-react";

export function SearchBar({ onSearch, initialValue = "" }: { onSearch: (q: string) => void; initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  function startVoiceSearch() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Pesquisa por voz não é suportada neste navegador.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue(transcript);
      onSearch(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
      className="flex items-center gap-2 rounded-full border border-base-border bg-base-surface px-4 py-3 focus-within:border-signal"
    >
      <Search className="h-5 w-5 shrink-0 text-paper-soft/50" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar por música, artista, álbum, gênero ou ano..."
        className="w-full bg-transparent font-body text-sm outline-none placeholder:text-paper-soft/40"
      />
      <button
        type="button"
        onClick={startVoiceSearch}
        aria-label="Pesquisar por voz"
        className={`shrink-0 rounded-full p-1.5 ${listening ? "bg-signal text-base animate-pulse" : "hover:text-signal"}`}
      >
        <Mic className="h-4 w-4" />
      </button>
    </form>
  );
}
