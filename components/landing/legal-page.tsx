import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { getSettings } from "@/lib/queries";

export async function LegalShell({
  title,
  description,
  updatedAt,
  children,
}: {
  title: string;
  description?: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const storeName = settings.store_name || "Mağaza";

  return (
    <>
      <AnnouncementBar text={settings.announcement_bar_text || "Hoş geldiniz!"} />
      <SiteHeader storeName={storeName} />

      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <header className="mb-10 border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {updatedAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              Son güncelleme: {updatedAt}
            </p>
          )}
        </header>

        <div className="prose-legal space-y-6 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>
      </main>

      <SiteFooter storeName={storeName} />
    </>
  );
}

export function LegalH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

export function LegalH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 text-base font-semibold text-foreground">{children}</h3>
  );
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed">{children}</p>;
}

export function LegalUl({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-2 marker:text-muted-foreground">
      {children}
    </ul>
  );
}

export function LegalOl({ children }: { children: React.ReactNode }) {
  return (
    <ol className="ml-5 list-decimal space-y-2 marker:text-muted-foreground">
      {children}
    </ol>
  );
}
