import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, _count: { select: { reviews: true, variants: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ürünler</h1>
          <p className="text-sm text-muted-foreground">{products.length} ürün</p>
        </div>
        <Link href="/admin/urunler/yeni">
          <Button><Plus size={18} /> Yeni Ürün</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Package size={40} className="opacity-30" />
            <p>Henüz ürün yok.</p>
            <Link href="/admin/urunler/yeni"><Button size="sm"><Plus size={16} /> İlk ürünü ekle</Button></Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Ürün</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Stok</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Varyant</th>
                <th className="px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/urunler/${p.id}`} className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-muted">
                        {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{p.sku ?? "—"}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(Number(p.price))}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={p.stock < 20 ? "font-semibold text-amber-600" : ""}>{p.stock}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p._count.variants}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isActive ? "success" : "neutral"}>{p.isActive ? "Aktif" : "Pasif"}</Badge>
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
