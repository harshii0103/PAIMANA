import { LayoutDashboard, Search, BarChart3, BellRing, Sparkles, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explorer", label: "Project Explorer", icon: Search },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Early Warnings", icon: BellRing },
];

export const ASSISTANT_NAV: NavItem = { href: "/assistant", label: "AI Assistant", icon: Sparkles };
export const SETTINGS_NAV: NavItem = { href: "/settings", label: "Settings", icon: Settings };
