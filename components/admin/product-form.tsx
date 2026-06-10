"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload, Trash2, ArrowUp, ArrowDown, Plus, Loader2, Save, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify, formatPrice } from "@/lib/utils";

type ImageRow = { url: string; alt: string };
type VariantRow = { name: string; value: string; priceDiff: number; stock: number };

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  stock: number;
  sku: string | null;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  videoUrl: string | null;
  images: ImageRow[];
  variants: VariantRow[];
};

const empty: ProductFormData = {
  name: "", slug: "", shortDescription: "", description: "",
  price: 0, compareAtPrice: null, costPrice: null, stock: 100, sku: "",
  isActive: true, seoTitle: "", seoDescription: "", videoUrl: "",
  images: [], variants: [],
};

const inputCls = "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelCls = "mb-1.5 block text-sm font-medium";

export function ProductForm({ initial }: { initial?: ProductFormData }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [d, setD] = React.useState<ProductFormData>(initial ?? empty);
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setD((p) => ({ ...p, [k]: v }));

  // Auto-slug from name unless the user edited it.
  React.useEffect(() => {
    if (!slugTouched) set("slug", slugify(d.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.name, slugTouched]);

  const profit =
    d.costPrice != null && d.costPrice > 0 ? d.price - d.costPrice : null;

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Yükleme hatası");
          continue;
        }
        setD((p) => ({ ...p, images: [...p.images, { url: data.url, alt: "" }] }));
      }
    } finally {
      setUploading(false);
    }
  }

  const moveImage = (i: number, dir: -1 | 1) => {
    setD((p) => {
      const arr = [...p.images];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...p, images: arr };
    });
  };
  const removeImage = (i: number) =>
    setD((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const addVariant = () =>
    setD((p) => ({ ...p, variants: [...p.variants, { name: "Renk", value: "", priceDiff: 0, stock: 100 }] }));
  const setVariant = (i: number, patch: Partial<VariantRow>) =>
    setD((p) => ({ ...p, variants: p.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)) }));
  const removeVariant = (i: number) =>
    setD((p) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));

  async function submit() {
    setError(null);
    if (!d.name || d.price <= 0) {
      setError("Ürün adı ve geçerli fiyat zorunlu.");
      return;
    }
    setSaving(true);
    const payload = {
      name: d.name,
      slug: slugify(d.slug || d.name),
      shortDescription: d.shortDescription,
      description: d.description,
      price: Number(d.price),
      compareAtPrice: d.compareAtPrice ? Number(d.compareAtPrice) : null,
      costPrice: d.costPrice ? Number(d.costPrice) : null,
      stock: Number(d.stock),
      sku: d.sku || null,
      isActive: d.isActive,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
      videoUrl: d.videoUrl || null,
      images: d.images.map((img, i) => ({ url: img.url, alt: img.alt || null, sortOrder: i })),
      variants: d.variants.map((v) => ({ name: v.name, value: v.value, priceDiff: Number(v.priceDiff), stock: Number(v.stock) })),
    };
    try {
      const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi");
        setSaving(false);
        return;
      }
      router.push("/admin/urunler");
      router.refresh();
    } catch {
      setError("Bağlantı hatası");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Basic */}
        <Card title="Temel Bilgiler">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Ürün Adı</label>
              <input className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Slug (URL)</label>
              <input className={inputCls} value={d.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
              <p className="mt-1 text-xs text-muted-foreground">/{slugify(d.slug || d.name)}</p>
            </div>
            <div>
              <label className={labelCls}>Kısa Açıklama</label>
              <textarea className={inputCls} rows={2} value={d.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Açıklama (HTML/Markdown)</label>
              <textarea className={`${inputCls} font-mono text-xs`} rows={8} value={d.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card title="Görseller">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-sm text-muted-foreground hover:border-accent hover:bg-accent-soft/20">
            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
            <span>{uploading ? "Yükleniyor..." : "Görsel yüklemek için tıklayın (max 5MB)"}</span>
            <input type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
          </label>
          {d.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {d.images.map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border">
                  <div className="relative aspect-square bg-muted">
                    <Image src={img.url} alt={img.alt} fill sizes="200px" className="object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        <Star size={10} /> Ana
                      </span>
                    )}
                  </div>
                  <input
                    className="w-full border-t px-2 py-1.5 text-xs outline-none"
                    placeholder="Alt metin"
                    value={img.alt}
                    onChange={(e) => setD((p) => ({ ...p, images: p.images.map((x, idx) => idx === i ? { ...x, alt: e.target.value } : x) }))}
                  />
                  <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => moveImage(i, -1)} className="grid h-6 w-6 place-items-center rounded bg-background/90 shadow"><ArrowUp size={12} /></button>
                    <button onClick={() => moveImage(i, 1)} className="grid h-6 w-6 place-items-center rounded bg-background/90 shadow"><ArrowDown size={12} /></button>
                    <button onClick={() => removeImage(i)} className="grid h-6 w-6 place-items-center rounded bg-background/90 text-danger shadow"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Variants */}
        <Card title="Varyantlar">
          <div className="space-y-2">
            {d.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-2">
                <input className={inputCls} placeholder="Tip (Renk)" value={v.name} onChange={(e) => setVariant(i, { name: e.target.value })} />
                <input className={inputCls} placeholder="Değer (Siyah)" value={v.value} onChange={(e) => setVariant(i, { value: e.target.value })} />
                <input className={`${inputCls} w-24`} type="number" placeholder="±Fiyat" value={v.priceDiff} onChange={(e) => setVariant(i, { priceDiff: Number(e.target.value) })} />
                <input className={`${inputCls} w-20`} type="number" placeholder="Stok" value={v.stock} onChange={(e) => setVariant(i, { stock: Number(e.target.value) })} />
                <button onClick={() => removeVariant(i)} className="grid h-9 w-9 place-items-center rounded-lg text-danger hover:bg-danger/10"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addVariant}>
            <Plus size={16} /> Varyant Ekle
          </Button>
        </Card>

        {/* SEO */}
        <Card title="SEO">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>SEO Başlık</label>
              <input className={inputCls} value={d.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>SEO Açıklama</label>
              <textarea className={inputCls} rows={2} value={d.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Video URL (embed)</label>
              <input className={inputCls} value={d.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://www.youtube.com/embed/..." />
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card title="Durum">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={d.isActive} onChange={(e) => set("isActive", e.target.checked)} />
            <span className="text-sm">Aktif (sitede görünür)</span>
          </label>
        </Card>

        <Card title="Fiyatlandırma">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Satış Fiyatı (₺)</label>
              <input className={inputCls} type="number" step="0.01" value={d.price} onChange={(e) => set("price", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Eski Fiyat (₺)</label>
              <input className={inputCls} type="number" step="0.01" value={d.compareAtPrice ?? ""} onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div>
              <label className={labelCls}>Maliyet (₺)</label>
              <input className={inputCls} type="number" step="0.01" value={d.costPrice ?? ""} onChange={(e) => set("costPrice", e.target.value ? Number(e.target.value) : null)} />
              {profit !== null && (
                <p className="mt-1 text-xs text-success">Kâr: {formatPrice(profit)} ({Math.round((profit / d.price) * 100) || 0}%)</p>
              )}
            </div>
          </div>
        </Card>

        <Card title="Envanter">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Stok</label>
              <input className={inputCls} type="number" value={d.stock} onChange={(e) => set("stock", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input className={inputCls} value={d.sku ?? ""} onChange={(e) => set("sku", e.target.value)} />
            </div>
          </div>
        </Card>

        {error && <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

        <Button size="lg" className="w-full" onClick={submit} disabled={saving}>
          {saving ? <><Loader2 size={18} className="animate-spin" /> Kaydediliyor...</> : <><Save size={18} /> {isEdit ? "Güncelle" : "Ürünü Kaydet"}</>}
        </Button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
