import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 bg-white py-24 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Settings className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h2 className="text-lg font-semibold text-ink-900">Settings</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-500">Workspace and account preferences will be available here. Coming soon.</p>
    </div>
  );
}
