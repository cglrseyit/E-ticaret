"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock, Tag, CreditCard, Banknote, ShieldCheck, Loader2, ChevronDown, ArrowLeft,
} from "lucide-react";
import { useCart, selectSubtotal } from "@/lib/store/cart";
import { useStoreConfig } from "@/lib/store/config";
import { checkoutFormSchema, type CheckoutFormInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { TR_CITIES } from "@/lib/tr-cities";
import { trackEvent } from "@/lib/analytics/track";

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  return parts.join(" ");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const subtotal = useCart(selectSubtotal);
  const config = useStoreConfig();

  const [coupon, setCoupon] = React.useState("");
  const [couponMsg, setCouponMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [discount, setDiscount] = React.useState(0);
  const [appliedCode, setAppliedCode] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const {
    register, handleSubmit, watch, setValue, formState: { errors },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { paymentMethod: "paytr" },
  });

  const paymentMethod = watch("paymentMethod");

  React.useEffect(() => {
    trackEvent("checkout_start");
  }, []);

  // Totals
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = afterDiscount >= config.freeShippingThreshold || subtotal === 0 ? 0 : config.shippingCost;
  const codFee = paymentMethod === "cod" ? config.codFee : 0;
  const total = afterDiscount + shipping + codFee;

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponMsg(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setAppliedCode(data.code);
        setCouponMsg({ ok: true, text: data.message || "Kupon uygulandı." });
      } else {
        setDiscount(0);
        setAppliedCode(null);
        setCouponMsg({ ok: false, text: data.message || "Geçersiz kupon." });
      }
    } catch {
      setCouponMsg({ ok: false, text: "Kupon doğrulanamadı." });
    }
  }

  async function onSubmit(values: CheckoutFormInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        couponCode: appliedCode ?? "",
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Sipariş oluşturulamadı.");
        setSubmitting(false);
        return;
      }
      trackEvent("purchase", { orderNumber: data.orderNumber, total: data.total });
      clear();
      router.push(data.redirectUrl);
    } catch {
      setServerError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Sepetin boş</h1>
        <p className="text-muted-foreground">Ödeme yapabilmek için sepete ürün ekle.</p>
        <Link href="/"><Button size="lg"><ArrowLeft size={18} /> Alışverişe başla</Button></Link>
      </main>
    );
  }

  const inputCls = "w-full rounded-xl border bg-background px-4 py-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
  const labelCls = "mb-1.5 block text-sm font-medium";
  const errCls = "mt-1 text-xs text-danger";

  const OrderSummary = (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.lineId} className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
              <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {it.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">{it.name}</p>
              {it.variantInfo && <p className="text-xs text-muted-foreground">{it.variantInfo}</p>}
            </div>
            <span className="text-sm font-semibold">{formatPrice(it.unitPrice * it.quantity)}</span>
          </li>
        ))}
      </ul>

      {/* Coupon */}
      <div className="border-t pt-4">
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
          <Tag size={15} /> Kupon kodu
        </label>
        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="HOSGELDIN10"
            className={inputCls}
          />
          <Button type="button" variant="outline" onClick={applyCoupon}>Uygula</Button>
        </div>
        {couponMsg && (
          <p className={cn("mt-1 text-xs", couponMsg.ok ? "text-success" : "text-danger")}>
            {couponMsg.text}
          </p>
        )}
      </div>

      {/* Totals */}
      <dl className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Ara toplam</dt><dd>{formatPrice(subtotal)}</dd></div>
        {discount > 0 && (
          <div className="flex justify-between text-success"><dt>İndirim {appliedCode && `(${appliedCode})`}</dt><dd>-{formatPrice(discount)}</dd></div>
        )}
        <div className="flex justify-between"><dt className="text-muted-foreground">Kargo</dt><dd>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</dd></div>
        {codFee > 0 && (
          <div className="flex justify-between"><dt className="text-muted-foreground">Kapıda ödeme</dt><dd>{formatPrice(codFee)}</dd></div>
        )}
        <div className="flex justify-between border-t pt-2 text-base font-bold">
          <dt>Toplam</dt><dd className="text-price">{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Ödeme</h1>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock size={15} className="text-accent" /> Güvenli ödeme
        </span>
      </div>

      {/* Mobile collapsible summary */}
      <div className="mt-4 lg:hidden">
        <button
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm"
        >
          <span className="font-medium">Sipariş özeti</span>
          <span className="flex items-center gap-2 font-bold text-price">
            {formatPrice(total)}
            <ChevronDown size={16} className={cn("transition-transform", summaryOpen && "rotate-180")} />
          </span>
        </button>
        {summaryOpen && <div className="mt-2 rounded-2xl border bg-card p-4">{OrderSummary}</div>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* Step 1: contact + address */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">1</span>
              İletişim & Teslimat
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Ad Soyad</label>
                <input {...register("customerName")} className={inputCls} placeholder="Ad Soyad" />
                {errors.customerName && <p className={errCls}>{errors.customerName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>E-posta</label>
                <input {...register("customerEmail")} type="email" className={inputCls} placeholder="ornek@eposta.com" />
                {errors.customerEmail && <p className={errCls}>{errors.customerEmail.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input
                  {...register("customerPhone")}
                  inputMode="numeric"
                  className={inputCls}
                  placeholder="5XX XXX XX XX"
                  onChange={(e) => setValue("customerPhone", formatPhone(e.target.value), { shouldValidate: true })}
                />
                {errors.customerPhone && <p className={errCls}>{errors.customerPhone.message}</p>}
              </div>
              <div>
                <label className={labelCls}>İl</label>
                <select {...register("city")} className={inputCls} defaultValue="">
                  <option value="" disabled>İl seçin</option>
                  {TR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className={errCls}>{errors.city.message}</p>}
              </div>
              <div>
                <label className={labelCls}>İlçe</label>
                <input {...register("district")} className={inputCls} placeholder="İlçe" />
                {errors.district && <p className={errCls}>{errors.district.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Açık Adres</label>
                <textarea {...register("address")} rows={3} className={inputCls} placeholder="Mahalle, cadde, sokak, bina no, daire no" />
                {errors.address && <p className={errCls}>{errors.address.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Posta Kodu (opsiyonel)</label>
                <input {...register("zipCode")} className={inputCls} placeholder="34000" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Sipariş Notu (opsiyonel)</label>
                <input {...register("note")} className={inputCls} placeholder="Teslimat notu" />
              </div>
            </div>
          </section>

          {/* Step 2: payment */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">2</span>
              Ödeme Yöntemi
            </h2>
            <div className="mt-5 space-y-3">
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition", paymentMethod === "paytr" ? "border-accent bg-accent-soft/30" : "border-border")}>
                <input type="radio" value="paytr" {...register("paymentMethod")} className="accent-[var(--accent)]" />
                <CreditCard size={20} className="text-accent" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Kredi / Banka Kartı</div>
                  <div className="text-xs text-muted-foreground">Güvenli ödeme (PayTR) · Test modu</div>
                </div>
              </label>
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition", paymentMethod === "cod" ? "border-accent bg-accent-soft/30" : "border-border")}>
                <input type="radio" value="cod" {...register("paymentMethod")} className="accent-[var(--accent)]" />
                <Banknote size={20} className="text-accent" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Kapıda Ödeme</div>
                  <div className="text-xs text-muted-foreground">+{formatPrice(config.codFee)} hizmet bedeli</div>
                </div>
              </label>
            </div>

            {/* Terms */}
            <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm">
              <input type="checkbox" {...register("acceptTerms")} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
              <span className="text-muted-foreground">
                <Link href="/mesafeli-satis" target="_blank" className="font-medium text-accent hover:underline">Mesafeli satış sözleşmesi</Link>ni okudum, onaylıyorum.
              </span>
            </label>
            {errors.acceptTerms && <p className={errCls}>{errors.acceptTerms.message}</p>}

            {serverError && (
              <div className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{serverError}</div>
            )}

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
              {submitting ? (<><Loader2 size={20} className="animate-spin" /> İşleniyor...</>) : (<><ShieldCheck size={20} /> Siparişi Tamamla — {formatPrice(total)}</>)}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={13} /> 256-bit SSL ile korunan güvenli ödeme
            </p>
          </section>
        </div>

        {/* Desktop sticky summary */}
        <aside className="hidden h-fit rounded-2xl border bg-card p-6 lg:sticky lg:top-20 lg:block">
          <h2 className="mb-4 font-bold">Sipariş Özeti</h2>
          {OrderSummary}
        </aside>
      </form>
    </main>
  );
}
