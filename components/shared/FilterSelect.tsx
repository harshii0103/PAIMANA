import { ChevronDown } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

/** Native select styled as a toolbar control. Highlights when a non-default option is selected. */
export function FilterSelect({
  value,
  onChange,
  options,
  label,
  defaultValue = "All",
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label: string;
  defaultValue?: string;
}) {
  return (
    <div className="ui-control relative flex items-center p-0" data-active={value !== defaultValue}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-full w-full cursor-pointer appearance-none bg-transparent py-0 pl-3 pr-8 text-[13px] font-medium focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink-900">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-ink-400" />
    </div>
  );
}
