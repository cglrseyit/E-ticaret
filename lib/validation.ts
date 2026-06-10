import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Ad soyad gerekli").max(80),
  customerEmail: z.string().email("Geçerli bir e-posta girin"),
  customerPhone: z
    .string()
    .regex(/^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, "Telefon 5XX XXX XX XX formatında olmalı"),
  city: z.string().min(2, "İl gerekli"),
  district: z.string().min(2, "İlçe gerekli"),
  address: z.string().min(10, "Açık adres en az 10 karakter olmalı").max(400),
  zipCode: z.string().max(10).optional().or(z.literal("")),
  note: z.string().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["paytr", "cod"]),
  couponCode: z.string().max(40).optional().or(z.literal("")),
  acceptTerms: z.literal(true, {
    message: "Mesafeli satış sözleşmesini onaylamalısınız",
  }),
  items: z.array(checkoutItemSchema).min(1, "Sepet boş"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Client form schema: items + coupon come from the cart store / local state,
// not the form fields, so they're validated separately (and on the server).
export const checkoutFormSchema = checkoutSchema.omit({
  items: true,
  couponCode: true,
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export const couponSchema = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().min(0),
});

export const trackSchema = z.object({
  type: z.enum([
    "page_view", "product_view", "time_on_page", "add_to_cart",
    "remove_from_cart", "checkout_start", "checkout_step", "purchase",
    "exit_intent",
  ]),
  path: z.string().max(300).optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  ctx: z
    .object({
      referrer: z.string().max(500).optional(),
      utmSource: z.string().max(120).optional(),
      utmMedium: z.string().max(120).optional(),
      utmCampaign: z.string().max(120).optional(),
    })
    .optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı gerekli").max(200),
  slug: z.string().min(2, "Slug gerekli").max(200),
  shortDescription: z.string().min(5, "Kısa açıklama gerekli").max(400),
  description: z.string().max(20000),
  price: z.number().min(0, "Fiyat 0 veya üstü olmalı"),
  compareAtPrice: z.number().min(0).nullable().optional(),
  costPrice: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  sku: z.string().max(80).nullable().optional(),
  isActive: z.boolean(),
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(400).nullable().optional(),
  videoUrl: z.string().max(500).nullable().optional(),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().max(200).nullable().optional(),
        sortOrder: z.number().int(),
      })
    )
    .max(12),
  variants: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        value: z.string().min(1).max(60),
        priceDiff: z.number(),
        stock: z.number().int().min(0),
      })
    )
    .max(30),
});

export type ProductInput = z.infer<typeof productSchema>;

export const reviewSchema = z.object({
  authorName: z.string().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).nullable().optional(),
  body: z.string().min(2).max(2000),
  isApproved: z.boolean(),
  isVerifiedPurchase: z.boolean(),
});

export const couponAdminSchema = z.object({
  code: z.string().min(2).max(40),
  type: z.enum(["percent", "fixed"]),
  value: z.number().min(0),
  isActive: z.boolean(),
  usageLimit: z.number().int().min(0).nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().max(80).nullable().optional(),
  cargoCompany: z.string().max(80).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});

export const settingsSchema = z.object({
  settings: z.record(z.string(), z.string()),
});

export const cartSyncSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productName: z.string().max(200),
        variantInfo: z.string().max(120).nullable().optional(),
        unitPrice: z.number().min(0),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .max(50),
});
