"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Send to your own logger / Sentry here when wired up.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle size={28} />
      </span>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Bir şeyler ters gitti
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Beklenmedik bir hata oluştu. Sayfayı tekrar yüklemeyi deneyebilir veya
        ana sayfaya dönebilirsiniz.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Hata kodu: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RefreshCw size={16} /> Tekrar Dene
        </Button>
        <Link href="/">
          <Button size="lg" variant="outline">
            <Home size={16} /> Ana Sayfa
          </Button>
        </Link>
      </div>
    </main>
  );
}
