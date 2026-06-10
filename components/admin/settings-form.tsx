"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const fields: { key: string; label: string; type?: string; hint?: string }[] = [
  { key: "store_name", label: "Mağaza Adı" },
  { key: "announcement_bar_text", label: "Duyuru Bandı Metni" },
  { key: "free_shipping_threshold", label: "Ücretsiz Kargo Eşiği (₺)", type: "number" },
  { key: "cod_fee", label: "Kapıda Ödeme Bedeli (₺)", type: "number" },
  { key: "whatsapp_number", label: "WhatsApp Numarası", hint: "Ülke koduyla, örn: 905555555555" },
  { key: "countdown_end", label: "Kampanya Geri Sayım Bitişi", type: "datetime-local" },
  { key: "live_viewers_base", label: "Canlı İzleyici Taban Değeri", type: "number" },
  { key: "social_proof_count", label: "Mutlu Müşteri Sayısı (metin)" },
  { key: "video_url", label: "Tanıtım Video URL (embed)" },
];

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of fields) {
      let val = initial[f.key] ?? "";
      // datetime-local needs "YYYY-MM-DDTHH:mm"
      if (f.type === "datetime-local" && val) {
        val = new Date(val).toISOString().slice(0, 16);
      }
      v[f.key] = val;
    }
    return v;
  });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const settings: Record<string, string> = { ...values };
    // Convert datetime-local back to ISO
    if (settings.countdown_end) settings.countdown_end = new Date(settings.countdown_end).toISOString();
    const res = await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const inputCls = "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-4 rounded-2xl border bg-card p-6">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
            <input
              type={f.type ?? "text"}
              className={inputCls}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            />
            {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        ))}
      </div>
      <Button size="lg" onClick={save} disabled={saving}>
        {saving ? <><Loader2 size={18} className="animate-spin" /> Kaydediliyor...</> : saved ? <><Check size={18} /> Kaydedildi</> : <><Save size={18} /> Ayarları Kaydet</>}
      </Button>
    </div>
  );
}
