"use client";

import * as React from "react";
import { Mail, Check, Loader2 } from "lucide-react";

export function CartRemindButton({ cartId }: { cartId: string }) {
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");

  async function send() {
    setState("loading");
    await fetch(`/api/admin/carts/${cartId}/remind`, { method: "POST" });
    setState("done");
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button
      onClick={send}
      disabled={state !== "idle"}
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-muted disabled:opacity-60"
    >
      {state === "loading" ? <Loader2 size={13} className="animate-spin" /> : state === "done" ? <Check size={13} className="text-success" /> : <Mail size={13} />}
      {state === "done" ? "Gönderildi" : "Hatırlat"}
    </button>
  );
}
