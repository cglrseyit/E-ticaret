import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!p) notFound();

  const initial: ProductFormData = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    costPrice: p.costPrice ? Number(p.costPrice) : null,
    stock: p.stock,
    sku: p.sku,
    isActive: p.isActive,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    videoUrl: p.videoUrl,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })),
    variants: p.variants.map((v) => ({ name: v.name, value: v.value, priceDiff: Number(v.priceDiff), stock: v.stock })),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/urunler" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="truncate text-2xl font-bold">{p.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
            <ExternalLink size={15} /> Sitede gör
          </Link>
          <DeleteProductButton id={p.id} />
        </div>
      </div>
      <ProductForm initial={initial} />
    </div>
  );
}
