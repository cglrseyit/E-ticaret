"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Giriş başarısız");
        setLoading(false);
        return;
      }
      router.push(params.get("from") || "/admin");
      router.refresh();
    } catch {
      setError("Bağlantı hatası");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border bg-background px-4 py-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-4 text-xl font-bold">Yönetim Paneli</h1>
          <p className="text-sm text-muted-foreground">Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 shadow-sm">
          <label className="mb-1.5 block text-sm font-medium">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="admin@site.com"
            autoComplete="username"
            required
          />
          <label className="mb-1.5 mt-4 block text-sm font-medium">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Giriş yapılıyor...
              </>
            ) : (
              <>
                <Lock size={18} /> Giriş Yap
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo: admin@site.com / Admin123!
        </p>
      </div>
    </div>
  );
}
