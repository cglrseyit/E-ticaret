import { ShoppingCart } from "lucide-react";
import type { ProductDTO } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/landing/section";
import { formatPrice, discountPercent } from "@/lib/utils";

export function FinalCta({ product }: { product: ProductDTO }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  return (
    <Section muted>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Rahatlamaya bugün başlayın
        </h2>
        <p className="mt-3 text-muted-foreground">
          Stoklar tükenmeden, indirimli fiyattan kaçırmayın.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="text-3xl font-extrabold text-price">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {discount && <Badge variant="sale" className="text-sm">%{discount}</Badge>}
        </div>

        <a href="#urun" className="mt-6 inline-block">
          <Button size="xl" className="px-12">
            <ShoppingCart size={22} />
            Hemen Sipariş Ver
          </Button>
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          🔒 Güvenli ödeme · 🚚 Hızlı kargo · 14 gün koşulsuz iade
        </p>
      </div>
    </Section>
  );
}
