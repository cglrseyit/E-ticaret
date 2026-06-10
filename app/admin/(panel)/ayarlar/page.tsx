import { getSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Ayarları</h1>
        <p className="text-sm text-muted-foreground">Duyuru bandı, kargo, kampanya ve görünüm ayarları</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
