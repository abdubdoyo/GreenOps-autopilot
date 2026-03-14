import { DashboardLayout } from "@/components/layout/Nav";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { RecentPlansTable } from "@/components/dashboard/RecentPlansTable";
import { SustainabilityPanel } from "@/components/dashboard/SustainabilityPanel";
import { WeeklySavingsChart, RegionEmissionsChart } from "@/components/charts/Charts";
import { DASHBOARD_METRICS } from "@/lib/mock-data/scenarios";
import Link from "next/link";
import { PlusSquare, Play } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Overview</h2>
          <p className="text-sm text-[#6b8f6b] mt-0.5">
            Carbon-aware scheduling performance · Last 30 days
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/plan/demo-llm-training"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(34,197,94,0.1)] text-[#22c55e] border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.2)] transition-all text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Demo Mode
          </Link>
          <Link
            href="/planner"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22c55e] text-[#0a0f0a] hover:bg-[#16a34a] transition-all text-sm font-semibold"
          >
            <PlusSquare className="w-4 h-4" />
            New Job
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <MetricsGrid metrics={DASHBOARD_METRICS} />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mt-6" id="analytics">
        <WeeklySavingsChart />
        <RegionEmissionsChart />
      </div>

      {/* Table + Sidebar */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="col-span-2">
          <RecentPlansTable />
        </div>
        <div>
          <SustainabilityPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}
