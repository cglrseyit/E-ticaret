"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const specs: [string, string][] = [
  ["Masaj Tipi", "3D Şiatsu (dönen başlıklar)"],
  ["Isıtma", "42°C akıllı ısıtma"],
  ["Mod Sayısı", "6 masaj modu"],
  ["Yoğunluk", "16 kademe"],
  ["Batarya", "2500 mAh Li-ion"],
  ["Kullanım Süresi", "Tek şarjla ~15 kullanım"],
  ["Ses Seviyesi", "45 dB (sessiz)"],
  ["Ağırlık", "1.1 kg"],
  ["Malzeme", "PU deri + ABS gövde"],
  ["Garanti", "2 yıl ithalatçı garantisi"],
];

const boxContents = [
  "1x NeckPro Max masaj cihazı",
  "1x USB-C şarj kablosu",
  "1x Taşıma çantası",
  "1x Türkçe kullanım kılavuzu",
  "1x Garanti belgesi",
];

const usageSteps = [
  "Cihazı tam şarj edin (ilk kullanımda ~3 saat).",
  "Güç düğmesine basılı tutarak açın.",
  "Boyun veya sırt bölgesine yerleştirin, kollardan hafifçe bastırın.",
  "Mod ve yoğunluğu kumandadan ayarlayın; isterseniz ısıtmayı açın.",
  "Günde 10-15 dakika kullanın. Aynı bölgede 15 dakikadan fazla kullanmayın.",
];

export function ProductTabs({ descriptionHtml }: { descriptionHtml: string }) {
  const tabs = ["Açıklama", "Teknik Özellikler", "Kutu İçeriği", "Kullanım"] as const;
  const [active, setActive] = React.useState(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl bg-muted p-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              active === i
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6 sm:p-8">
        {active === 0 && (
          <div
            className="prose-sm space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_li]:ml-1 [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:space-y-2"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        {active === 1 && (
          <dl className="divide-y divide-border">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === 2 && (
          <ul className="space-y-3">
            {boxContents.map((c) => (
              <li key={c} className="flex items-center gap-3 text-[15px]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-hover">
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        )}

        {active === 3 && (
          <ol className="space-y-4">
            {usageSteps.map((s, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-muted-foreground">{s}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
