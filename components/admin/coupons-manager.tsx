"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";

export type AdminCoupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
};

export function CouponsManager({ coupons }: { coupons: AdminCoupon[] }) {
  const router = useRouter();
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ code: "", type: "percent", value: 10, usageLimit: "", expiresAt: "" });

  async function create() {
    if (!form.code) return;
    const res = await fetch("/api/admin/coupons", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code, type: form.type, value: Number(form.value), isActive: true,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    if (res.ok) {
      setForm({ code: "", type: "percent", value: 10, usageLimit: "", expiresAt: "" });
      setAdding(false);
      router.refresh();
    } else {
      const d = await res.json();
      alert(d.error || "Hata");
    }
  }
  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/coupons/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive }) });
    router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Kuponu sil?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputCls = "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAdding((a) => !a)}><Plus size={16} /> Kupon Ekle</Button>
      </div>

      {adding && (
        <div className="grid gap-3 rounded-2xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-5">
          <input className={inputCls} placeholder="KOD" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="percent">Yüzde (%)</option>
            <option value="fixed">Sabit (₺)</option>
          </select>
          <input className={inputCls} type="number" placeholder="Değer" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          <input className={inputCls} type="number" placeholder="Limit (boş=sınırsız)" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          <input className={inputCls} type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <Button size="sm" className="lg:col-span-5" onClick={create}>Kaydet</Button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-card">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Ticket size={32} className="opacity-30" /> Henüz kupon yok.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Kod</th>
                <th className="px-4 py-3 font-medium">İndirim</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Kullanım</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                  <td className="px-4 py-3">{c.type === "percent" ? `%${c.value}` : formatPrice(c.value)}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(c.id, !c.isActive)}>
                      <Badge variant={c.isActive ? "success" : "neutral"} className={cn("cursor-pointer")}>
                        {c.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(c.id)} className="text-danger hover:opacity-70"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
