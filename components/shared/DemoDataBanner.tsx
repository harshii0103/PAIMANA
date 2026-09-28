import { FlaskConical } from "lucide-react";

/**
 * Subtle but explicit disclosure. Uses brand (not risk) colors so it is never mistaken
 * for a risk signal.
 */
export function DemoDataBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-brand-100 bg-brand-25 px-3.5 py-2 text-brand-800 sm:items-center">
      <span className="mt-px inline-flex shrink-0 items-center gap-1.5 rounded border border-brand-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-brand-700 sm:mt-0">
        <FlaskConical className="h-3 w-3" strokeWidth={2} />
        DEMO DATA
      </span>
      <p className="text-[12px] leading-snug text-ink-600">
        Project names are illustrative. Risk scores and alerts are placeholder values — not real CatBoost
        predictions or official assessments.
      </p>
    </div>
  );
}
