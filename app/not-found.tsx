import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 select-none text-7xl font-black tracking-tighter text-accent sm:text-8xl">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Aradığınız sayfa taşınmış, silinmiş ya da adres yanlış yazılmış olabilir.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button size="lg">
            <Home size={16} /> Ana Sayfaya Dön
          </Button>
        </Link>
        <Link href="/siparis-takip">
          <Button size="lg" variant="outline">
            <Search size={16} /> Sipariş Sorgula
          </Button>
        </Link>
      </div>

      <Link
        href="/iletisim"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Yardıma ihtiyacın var mı? İletişime geç
      </Link>
    </main>
  );
}
