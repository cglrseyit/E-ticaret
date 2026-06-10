"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2, Plus, Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { cn } from "@/lib/utils";

export type AdminReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
};

export function ReviewsManager({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ authorName: "", rating: 5, title: "", body: "", isVerifiedPurchase: true });

  async function toggle(id: string, isApproved: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Yorumu sil?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    router.refresh();
  }
  async function create() {
    if (!form.authorName || !form.body) return;
    await fetch("/api/admin/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isApproved: true, title: form.title || null }),
    });
    setForm({ authorName: "", rating: 5, title: "", body: "", isVerifiedPurchase: true });
    setAdding(false);
    router.refresh();
  }

  const inputCls = "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAdding((a) => !a)}><Plus size={16} /> Yorum Ekle</Button>
      </div>

      {adding && (
        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputCls} placeholder="Yazar adı" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            <select className={inputCls} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} yıldız</option>)}
            </select>
          </div>
          <input className={inputCls} placeholder="Başlık (opsiyonel)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className={inputCls} rows={3} placeholder="Yorum" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={form.isVerifiedPurchase} onChange={(e) => setForm({ ...form, isVerifiedPurchase: e.target.checked })} />
            Doğrulanmış alışveriş
          </label>
          <Button size="sm" onClick={create}>Kaydet</Button>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className={cn("rounded-2xl border bg-card p-4", !r.isApproved && "opacity-60")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  {r.authorName}
                  {r.isVerifiedPurchase && <BadgeCheck size={14} className="text-accent" />}
                  {!r.isApproved && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">Onay bekliyor</span>}
                </div>
                <Stars value={r.rating} size={13} className="mt-1" />
                {r.title && <p className="mt-1.5 text-sm font-medium">{r.title}</p>}
                <p className="mt-0.5 text-sm text-muted-foreground">{r.body}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => toggle(r.id, !r.isApproved)} className={cn("grid h-8 w-8 place-items-center rounded-lg", r.isApproved ? "text-amber-600 hover:bg-amber-50" : "text-success hover:bg-success/10")} title={r.isApproved ? "Onayı kaldır" : "Onayla"}>
                  {r.isApproved ? <X size={16} /> : <Check size={16} />}
                </button>
                <button onClick={() => remove(r.id)} className="grid h-8 w-8 place-items-center rounded-lg text-danger hover:bg-danger/10" title="Sil">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Star size={32} className="opacity-30" /> Henüz yorum yok.
          </div>
        )}
      </div>
    </div>
  );
}
