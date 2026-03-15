"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Nav";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { RecentPlansTable } from "@/components/dashboard/RecentPlansTable";
import { SustainabilityPanel } from "@/components/dashboard/SustainabilityPanel";
import { WeeklySavingsChart, RegionEmissionsChart } from "@/components/charts/Charts";
import { getQueue, getHistory } from "@/lib/store/execution";
import { DashboardMetrics } from "@/lib/types";
import Link from "next/link";
import { PlusSquare, Play, Trash2 } from "lucide-react";
import { clearAllData } from "@/lib/store/execution";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalJobsAnalyzed: 0,
    activeJobs: 0,
    totalCO2SavedKg: 0,
    avgOptimizationRate: 0,
    totalCostDeltaUSD: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      const queue = getQueue();
      const history = getHistory();
      
      const totalCO2 = history.reduce((acc, job) => acc + job.optimizedPlan.co2SavedKg, 0);
      const totalCost = history.reduce((acc, job) => acc + job.optimizedPlan.costDeltaUSD, 0);
      const avgOpt = history.length > 0 
        ? history.reduce((acc, job) => acc + job.optimizedPlan.co2SavedPercent, 0) / history.length 
        : 0;

      setMetrics({
        totalJobsAnalyzed: history.length + queue.length,
        activeJobs: queue.length,
        totalCO2SavedKg: totalCO2,
        avgOptimizationRate: avgOpt,
        totalCostDeltaUSD: totalCost,
      });
      setIsLoading(false);
    };

    updateMetrics();
    window.addEventListener("greenops_storage_update", updateMetrics);
    return () => window.removeEventListener("greenops_storage_update", updateMetrics);
  }, []);
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
          <button
            onClick={() => { if(confirm("Clear all job data?")) clearAllData(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.2)] transition-all text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
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
      <MetricsGrid metrics={metrics} />

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
