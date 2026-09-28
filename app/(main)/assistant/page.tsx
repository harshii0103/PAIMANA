import { Sparkles } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 bg-white py-24 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h2 className="text-lg font-semibold text-ink-900">AI Assistant — Coming Soon</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        A natural-language interface for data-backed project queries (e.g. &quot;Show me high-risk
        road projects&quot;), backed by the Risk Engine — not a predictor itself.
      </p>
    </div>
  );
}
