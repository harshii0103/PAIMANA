import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  cta = { href: "/dashboard", label: "Back to Dashboard" },
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-lg border border-ink-200 bg-white px-6 py-14 text-center shadow-card">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h2 className="text-base font-semibold text-ink-900">{title}</h2>
      <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-500">{description}</p>
      <Link href={cta.href} className="ui-button-primary mt-6">
        {cta.label} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
