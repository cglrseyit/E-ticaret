"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle size={22} />
      </span>
      <h2 className="text-lg font-semibold">Sayfa yüklenemedi</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {error.digest}
        </p>
      )}
      <Button onClick={reset} className="mt-5">
        <RefreshCw size={16} /> Tekrar Dene
      </Button>
    </div>
  );
}
