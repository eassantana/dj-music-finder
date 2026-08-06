"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.toString?.() ?? "Erro ao cadastrar.");
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 font-display text-2xl font-semibold">Criar conta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Senha (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" className="rounded-lg bg-signal py-2 text-sm font-medium text-base hover:bg-signal-bright">
          Criar conta
        </button>
      </form>
      <p className="mt-4 text-sm text-paper-soft/60">
        Já tem conta?{" "}
        <Link href="/login" className="text-signal hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
