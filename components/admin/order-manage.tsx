"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUSES = [
  ["pending", "Bekliyor"], ["paid", "Ödendi"], ["shipped", "Kargoda"],
  ["delivered", "Teslim Edildi"], ["cancelled", "İptal"], ["refunded", "İade"],
] as const;

const CARGOS = ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo", "PTT Kargo", "UPS"];

export function OrderManage({
  orderNumber,
  initial,
}: {
  orderNumber: string;
  initial: {
    status: string;
    paymentStatus: string;
    cargoCompany: string | null;
    trackingNumber: string | null;
    note: string | null;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState(initial.status);
  const [cargo, setCargo] = React.useState(initial.cargoCompany ?? "");
  const [tracking, setTracking] = React.useState(initial.trackingNumber ?? "");
  const [note, setNote] = React.useState(initial.note ?? "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        cargoCompany: cargo || null,
        trackingNumber: tracking || null,
        note: note || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const inputCls = "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const labelCls = "mb-1.5 block text-sm font-medium";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Sipariş Durumu</label>
        <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Kargo Firması</label>
        <select className={inputCls} value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="">Seçilmedi</option>
          {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Takip Numarası</label>
        <input className={inputCls} value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="TR..." />
        <p className="mt-1 text-xs text-muted-foreground">Kargo + takip girilince müşteriye e-posta gönderilir.</p>
      </div>
      <div>
        <label className={labelCls}>Sipariş Notu</label>
        <textarea className={inputCls} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button className="w-full" onClick={save} disabled={saving}>
        {saving ? <><Loader2 size={18} className="animate-spin" /> Kaydediliyor...</> : saved ? <><Check size={18} /> Kaydedildi</> : <><Save size={18} /> Güncelle</>}
      </Button>
    </div>
  );
}
