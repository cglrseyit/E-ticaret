import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  // Mock gateway: mark online payments as paid on the success page.
  if (order.paymentMethod !== "cod" && order.paymentStatus !== "paid") {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "paid", status: "paid" },
    });
    order.paymentStatus = "paid";
    order.status = "paid";
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 size={48} />
        </span>
        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">Siparişiniz alındı! 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          Teşekkürler {order.customerName.split(" ")[0]}. Sipariş onayı e-postanıza gönderildi.
        </p>
        <div className="mt-4 rounded-xl bg-muted px-5 py-2.5 text-sm">
          Sipariş No: <strong className="font-mono">{order.orderNumber}</strong>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border bg-card p-6">
        <h2 className="font-bold">Sipariş Özeti</h2>
        <ul className="mt-4 divide-y">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium">{it.productName}</p>
                {it.variantInfo && <p className="text-xs text-muted-foreground">{it.variantInfo}</p>}
                <p className="text-xs text-muted-foreground">Adet: {it.quantity}</p>
              </div>
              <span className="font-semibold">{formatPrice(Number(it.unitPrice) * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Ara toplam</dt><dd>{formatPrice(Number(order.subtotal))}</dd></div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-success"><dt>İndirim</dt><dd>-{formatPrice(Number(order.discount))}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-muted-foreground">Kargo</dt><dd>{Number(order.shippingCost) === 0 ? "Ücretsiz" : formatPrice(Number(order.shippingCost))}</dd></div>
          <div className="flex justify-between border-t pt-2 text-base font-bold"><dt>Toplam</dt><dd className="text-price">{formatPrice(Number(order.total))}</dd></div>
        </dl>
        <div className="mt-4 rounded-xl bg-muted/60 px-4 py-3 text-sm">
          <p className="font-medium">Teslimat Adresi</p>
          <p className="mt-1 text-muted-foreground">
            {order.customerName} · {order.customerPhone}<br />
            {order.address}, {order.district} / {order.city}
          </p>
          <p className="mt-2 text-muted-foreground">
            Ödeme: {order.paymentMethod === "cod" ? "Kapıda Ödeme" : "Kredi/Banka Kartı"}
          </p>
        </div>
      </div>

      {/* What's next */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Mail, t: "Onay e-postası", s: "Birkaç dakika içinde" },
          { icon: Package, t: "Hazırlanıyor", s: "1-2 iş günü içinde" },
          { icon: Truck, t: "Kargoda", s: "Takip no SMS ile" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border bg-card p-4 text-center">
            <s.icon size={22} className="mx-auto text-accent" />
            <p className="mt-2 text-sm font-semibold">{s.t}</p>
            <p className="text-xs text-muted-foreground">{s.s}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href={`/siparis-takip?order=${order.orderNumber}`}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">Siparişimi Takip Et</Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">Alışverişe Devam Et</Button>
        </Link>
      </div>
    </main>
  );
}
