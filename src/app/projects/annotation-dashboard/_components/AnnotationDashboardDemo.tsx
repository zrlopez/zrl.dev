"use client";
import { useState } from "react";
import { DashboardKpiRow }    from "./DashboardKpiRow";
import { DashboardTabs, type TabId } from "./DashboardTabs";
import { useLiveKpis }         from "./useLiveKpis";
import { SEED_DATA }           from "./dashboardData";
import { OverviewTab }         from "./tabs/OverviewTab";
import { ThroughputTab }       from "./tabs/ThroughputTab";
import { ErrorsTab }           from "./tabs/ErrorsTab";
import { TeamPerformanceTab }  from "./tabs/TeamPerformanceTab";
import { CapacityForecastingTab } from "./tabs/CapacityForecastingTab";
import { AlertsTab }           from "./tabs/AlertsTab";

export function AnnotationDashboardDemo() {
  const [tab, setTab]     = useState<TabId>("overview");
  const [dark, setDark]   = useState(false);
  const kpis              = useLiveKpis(5000);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Annotation Dashboard</h1>
              <p className="text-xs text-muted-foreground">Live KPIs refresh every 5 seconds</p>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              {dark ? "☀ Light" : "☾ Dark"}
            </button>
          </div>

          {/* KPI row */}
          <DashboardKpiRow kpis={kpis} />

          {/* Tabs */}
          <DashboardTabs active={tab} onChange={setTab} />

          {/* Tab content */}
          {tab === "overview"   && <OverviewTab            kpis={kpis} isDark={dark} data={SEED_DATA} />}
          {tab === "throughput" && <ThroughputTab                      isDark={dark} data={SEED_DATA} />}
          {tab === "errors"     && <ErrorsTab                          isDark={dark} data={SEED_DATA} />}
          {tab === "team"       && <TeamPerformanceTab                 isDark={dark} data={SEED_DATA} />}
          {tab === "capacity"   && <CapacityForecastingTab             isDark={dark} data={SEED_DATA} />}
          {tab === "alerts"     && <AlertsTab              kpis={kpis} isDark={dark} data={SEED_DATA} />}

        </div>
      </div>
    </div>
  );
}
