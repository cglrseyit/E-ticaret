"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Menu, X, LogOut, ExternalLink } from "lucide-react";
import { adminNav } from "@/components/admin/sidebar-nav";
import { cn } from "@/lib/utils";

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const NavLinks = (
    <nav className="flex flex-col gap-1">
      {adminNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            isActive(item.href)
              ? "bg-accent text-accent-foreground"
              : "text-stone-300 hover:bg-white/10 hover:text-white"
          )}
        >
          <item.icon size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-primary p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent">
            <ShieldCheck size={18} />
          </span>
          <span className="font-bold">Yönetim</span>
        </Link>
        {NavLinks}
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={18} /> Siteyi Gör
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-primary p-4">
            <div className="mb-6 flex items-center justify-between px-2 text-white">
              <span className="font-bold">Yönetim</span>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            {NavLinks}
            <button onClick={logout} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/10">
              <LogOut size={18} /> Çıkış Yap
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg hover:bg-muted lg:hidden"
            aria-label="Menü"
          >
            <Menu size={20} />
          </button>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-tight">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {user.name.charAt(0)}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
