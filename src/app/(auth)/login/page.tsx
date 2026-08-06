"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email ou senha inválidos.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 font-display text-2xl font-semibold">Entrar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border border-base-border bg-base-surface px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" className="rounded-lg bg-signal py-2 text-sm font-medium text-base hover:bg-signal-bright">
          Entrar
        </button>
      </form>
      <p className="mt-4 text-sm text-paper-soft/60">
        Não tem conta?{" "}
        <Link href="/register" className="text-signal hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
