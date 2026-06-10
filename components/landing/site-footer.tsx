import Link from "next/link";
import { ShieldCheck, Mail, Phone, Camera, Share2 } from "lucide-react";

const legal = [
  { href: "/sss", label: "Sık Sorulan Sorular" },
  { href: "/iade-ve-degisim", label: "İade & Değişim" },
  { href: "/garanti", label: "Garanti Koşulları" },
  { href: "/kargo-ve-teslimat", label: "Kargo & Teslimat" },
  { href: "/mesafeli-satis", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/gizlilik-politikasi", label: "Gizlilik / KVKK" },
  { href: "/siparis-takip", label: "Sipariş Takip" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteFooter({ storeName }: { storeName: string }) {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
                <ShieldCheck size={18} />
              </span>
              <span className="text-lg font-bold">{storeName}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sağlığınız ve konforunuz için tasarlanmış premium ürünler. Güvenli
              alışveriş, hızlı kargo.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Kurumsal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {legal.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Yasal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {legal.slice(4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">İletişim</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail size={15} /> destek@example.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} /> 0850 000 00 00
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted">
                <Camera size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted">
                <Share2 size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {storeName}. Tüm hakları saklıdır.</span>
          <span>[ŞİRKET ADI] · [ADRES]</span>
        </div>
      </div>
    </footer>
  );
}
