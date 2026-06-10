import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form hatalı", issues: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const slug = slugify(d.slug || d.name);

  const conflict = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (conflict) {
    return NextResponse.json({ error: "Bu slug başka bir üründe kullanılıyor" }, { status: 409 });
  }

  // Replace images + variants in a transaction with the field updates.
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        slug,
        name: d.name,
        shortDescription: d.shortDescription,
        description: d.description,
        price: d.price,
        compareAtPrice: d.compareAtPrice ?? null,
        costPrice: d.costPrice ?? null,
        stock: d.stock,
        sku: d.sku || null,
        isActive: d.isActive,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
        videoUrl: d.videoUrl || null,
        images: {
          create: d.images.map((img, i) => ({
            url: img.url, alt: img.alt || null, sortOrder: img.sortOrder ?? i,
          })),
        },
        variants: {
          create: d.variants.map((v, i) => ({
            name: v.name, value: v.value, priceDiff: v.priceDiff, stock: v.stock, sortOrder: i,
          })),
        },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
