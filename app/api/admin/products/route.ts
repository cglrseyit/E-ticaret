import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const slug = slugify(d.slug || d.name);

  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 409 });
  }

  const product = await prisma.product.create({
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
  });

  return NextResponse.json({ ok: true, id: product.id, slug: product.slug });
}
