import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/sepet", priority: 0.3, changeFrequency: "weekly" },
    { path: "/odeme", priority: 0.3, changeFrequency: "weekly" },
    { path: "/siparis-takip", priority: 0.6, changeFrequency: "monthly" },
    { path: "/sss", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kargo-ve-teslimat", priority: 0.6, changeFrequency: "monthly" },
    { path: "/iade-ve-degisim", priority: 0.6, changeFrequency: "monthly" },
    { path: "/garanti", priority: 0.5, changeFrequency: "yearly" },
    { path: "/mesafeli-satis", priority: 0.4, changeFrequency: "yearly" },
    { path: "/gizlilik-politikasi", priority: 0.4, changeFrequency: "yearly" },
    { path: "/iletisim", priority: 0.6, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
