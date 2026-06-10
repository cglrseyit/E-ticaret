import Link from "next/link";
import { XCircle, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function FailurePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reason?: string }>;
}) {
  const { order, reason } = await searchParams;

  return (
    <main className="mx-auto max-w-xl px-4 py-20">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-danger/15 text-danger">
          <XCircle size={48} />
        </span>
        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">Ödeme tamamlanamadı</h1>
        <p className="mt-2 text-muted-foreground">
          {reason || "Ödeme sırasında bir sorun oluştu. Tutar hesabınızdan çekilmedi."}
        </p>
        {order && (
          <div className="mt-4 rounded-xl bg-muted px-5 py-2.5 text-sm">
            Sipariş No: <strong className="font-mono">{order}</strong>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link href="/odeme">
            <Button size="lg" className="w-full sm:w-auto">
              <RefreshCw size={18} /> Tekrar Dene
            </Button>
          </Link>
          <Link href="/iletisim">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <MessageCircle size={18} /> Destek Al
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
