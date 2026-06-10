import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { CartButton } from "@/components/landing/cart-button";

export function SiteHeader({ storeName }: { storeName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
            <ShieldCheck size={18} />
          </span>
          <span className="text-base font-bold tracking-tight sm:text-lg">
            {storeName}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            🔒 Güvenli Alışveriş
          </span>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
