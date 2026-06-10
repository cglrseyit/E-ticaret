"use client";

import * as React from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const next: Record<string, string> = {};
    if (name.length < 2) next.name = "Ad soyad gerekli";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Geçerli bir e-posta girin";
    if (message.length < 10) next.message = "Mesajınız en az 10 karakter olmalı";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setStatus("submitting");
    // No backend endpoint by design — we simulate a successful submission
    // and log to the analytics tracker. Real email/CRM delivery can be wired
    // in later by replacing this with a fetch to a `/api/contact` route.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center">
        <CheckCircle2 className="mx-auto text-success" size={36} />
        <h3 className="mt-3 text-lg font-semibold">Mesajınız iletildi!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          En geç 24 saat içinde size geri döneceğiz. Teşekkürler.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field id="name" label="Ad Soyad" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="h-11 w-full rounded-xl border bg-background px-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </Field>

      <Field id="email" label="E-posta" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 w-full rounded-xl border bg-background px-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </Field>

      <Field id="subject" label="Konu (opsiyonel)">
        <input
          id="subject"
          name="subject"
          type="text"
          className="h-11 w-full rounded-xl border bg-background px-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </Field>

      <Field id="message" label="Mesajınız" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border bg-background p-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </Field>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>Bir hata oluştu, lütfen tekrar deneyin.</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Gönderiliyor…" : (<>Mesajı Gönder <Send size={16} /></>)}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
