import {
  LayoutDashboard, BarChart3, Radio, Package, ShoppingCart,
  MessageSquareText, Ticket, Settings, type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analitik", label: "Analitik", icon: BarChart3 },
  { href: "/admin/canli", label: "Canlı", icon: Radio },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingCart },
  { href: "/admin/sepetler", label: "Sepetler", icon: ShoppingCart },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquareText },
  { href: "/admin/kuponlar", label: "Kuponlar", icon: Ticket },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];
