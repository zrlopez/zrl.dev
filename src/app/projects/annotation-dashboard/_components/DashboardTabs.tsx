"use client";

const TABS = [
  { id: "overview",   label: "Overview"   },
  { id: "throughput", label: "Throughput" },
  { id: "errors",     label: "Errors"     },
  { id: "team",       label: "Team"       },
  { id: "capacity",   label: "Capacity"   },
  { id: "alerts",     label: "Alerts"     },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function DashboardTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            active === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
