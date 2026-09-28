"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOpenAlertCount } from "@/hooks/useAlerts";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Portfolio overview & risk intelligence",
  },
  "/explorer": {
    title: "Project Explorer",
    description: "Search and filter every monitored project by code, sector, ministry, state, or risk.",
  },
  "/analytics": {
    title: "Analytics",
    description: "Sector patterns, cost trends, and progress-risk relationships across the portfolio.",
  },
  "/assistant": {
    title: "AI Assistant",
    description: "Conversational project queries — coming soon.",
  },
  "/settings": {
    title: "Settings",
    description: "Workspace and account preferences.",
  },
  "/alerts": {
    title: "Early Warnings",
    description: "Alert events generated when a project's risk state changes.",
  },
};

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const meta =
    PAGE_META[pathname] ??
    (pathname.startsWith("/projects/")
      ? { title: "Project Details", description: "Risk profile for a single monitored project." }
      : PAGE_META["/dashboard"]);
  const [query, setQuery] = useState("");
  const openAlertCount = useOpenAlertCount();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/explorer?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center gap-5 px-4 py-3 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-ink-500 transition-colors hover:bg-ink-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] font-semibold leading-tight tracking-tight text-ink-900 sm:text-lg">
            {meta.title}
          </h1>
          <p className="hidden truncate text-[13px] text-ink-500 sm:block">{meta.description}</p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden items-center gap-2 rounded-md border border-ink-200 bg-ink-25 px-3 py-1.5 text-sm text-ink-400 transition-colors focus-within:border-brand-400 focus-within:bg-white focus-within:text-ink-700 focus-within:ring-1 focus-within:ring-brand-100 md:flex md:w-60 lg:w-72"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project code or name…"
            aria-label="Search projects"
            className="w-full bg-transparent text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-1 border-l border-ink-100 pl-4">
          <Link
            href="/alerts"
            className="relative rounded-md p-2 text-ink-500 transition-colors hover:bg-ink-100"
            aria-label={openAlertCount > 0 ? `${openAlertCount} open alerts` : "No open alerts"}
            title={openAlertCount > 0 ? `${openAlertCount} open alert${openAlertCount === 1 ? "" : "s"}` : "No open alerts"}
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {openAlertCount > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-risk-high px-0.5 text-[9px] font-semibold leading-none text-white ring-2 ring-white">
                {openAlertCount}
              </span>
            )}
          </Link>

          <div className="ml-1 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-[11px] font-semibold tracking-wide text-white">
              PM
            </div>
            <div className="hidden leading-tight xl:block">
              <div className="text-[13px] font-medium text-ink-900">Portfolio Analyst</div>
              <div className="text-[11px] text-ink-500">PAIMANA workspace</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
