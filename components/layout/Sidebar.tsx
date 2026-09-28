"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOpenAlertCount } from "@/hooks/useAlerts";
import { NAV_ITEMS, ASSISTANT_NAV, SETTINGS_NAV } from "@/lib/navigation";
import { Radar } from "lucide-react";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  // Real open-alert count from the data layer — never hardcoded.
  const openAlertCount = useOpenAlertCount();
  const AssistantIcon = ASSISTANT_NAV.icon;
  const SettingsIcon = SETTINGS_NAV.icon;

  return (
    <nav className="flex h-full flex-col bg-brand-900 text-brand-100">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 ring-1 ring-white/10">
          <Radar className="h-[18px] w-[18px] text-white" size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-white">PAIMANA</div>
          <div className="truncate text-[11px] text-brand-300">Infrastructure Intelligence</div>
        </div>
      </div>
      <div className="mx-5 mb-3 h-px bg-white/[0.06]" />

      <div className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors",
                active
                  ? "bg-white/[0.07] font-medium text-white"
                  : "text-brand-200 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-white transition-opacity",
                  active ? "opacity-90" : "opacity-0"
                )}
              />
              <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-white" : "text-brand-300")} size={18} strokeWidth={1.75} />
              <span className="truncate">{item.label}</span>
              {item.href === "/alerts" && openAlertCount > 0 ? (
                <span
                  className="ml-auto rounded-full bg-risk-high px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
                  aria-label={`${openAlertCount} open alerts`}
                >
                  {openAlertCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="px-3 pb-4 pt-2">
        <div className="mx-2 mb-2 h-px bg-white/[0.06]" />
        <Link
          href={ASSISTANT_NAV.href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] text-brand-200 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <AssistantIcon className="h-[18px] w-[18px] shrink-0 text-brand-300" size={18} strokeWidth={1.75} />
          <span className="truncate">AI Assistant</span>
          <span className="ml-auto rounded border border-white/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-brand-300">
            SOON
          </span>
        </Link>
        <Link
          href={SETTINGS_NAV.href}
          onClick={onNavigate}
          className={cn(
            "mt-0.5 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors",
            pathname === SETTINGS_NAV.href ? "bg-white/[0.07] font-medium text-white" : "text-brand-200 hover:bg-white/[0.04] hover:text-white"
          )}
        >
          <SettingsIcon className="h-[18px] w-[18px] shrink-0 text-brand-300" size={18} strokeWidth={1.75} />
          <span className="truncate">{SETTINGS_NAV.label}</span>
        </Link>
      </div>
    </nav>
  );
}
