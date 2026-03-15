"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Clock, XCircle, Play, Trash2, ExternalLink } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { getQueue, getHistory, executeJob, removeFromQueue } from "@/lib/store/execution";
import { formatCO2, formatCurrency, formatDateTime } from "@/lib/utils";
import { PlanResponse } from "@/lib/types";

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: "#22c55e", variant: "green" as const },
  running:   { icon: Loader2,      color: "#0ea5e9", variant: "blue" as const },
  queued:    { icon: Clock,        color: "#eab308", variant: "yellow" as const },
  failed:    { icon: XCircle,      color: "#ef4444", variant: "red" as const },
};

export function RecentPlansTable() {
  const [queue, setQueue] = useState<PlanResponse[]>([]);
  const [history, setHistory] = useState<PlanResponse[]>([]);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const refreshData = () => {
    setQueue(getQueue());
    setHistory(getHistory());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("greenops_storage_update", refreshData);
    return () => window.removeEventListener("greenops_storage_update", refreshData);
  }, []);

  async function handleExecute(jobId: string) {
    setExecutingId(jobId);
    await new Promise(r => setTimeout(r, 1500));
    executeJob(jobId);
    setExecutingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Pending Queue */}
      <div className="glass-card p-0 overflow-hidden border-[rgba(234,179,8,0.2)]">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(234,179,8,0.1)] bg-[rgba(234,179,8,0.02)]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#eab308] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Execution Pipeline
            </h3>
            <p className="text-xs text-[#4a6b4a] mt-0.5">Jobs waiting for optimal low-carbon windows</p>
          </div>
          {queue.length > 0 && (
             <div className="text-xs text-[#eab308] font-semibold">{queue.length} job(s) pending</div>
          )}
        </div>

        <div className="overflow-x-auto">
          {queue.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-[#4a6b4a]">No jobs in the pipeline.</p>
              <Link href="/planner" className="text-xs text-[#22c55e] mt-2 inline-block hover:underline">Plan a new job →</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(34,197,94,0.06)]">
                  {["Job Name", "Target Region", "Potential Savings", "Cost", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#4a6b4a]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queue.map((plan) => (
                  <tr key={plan.optimizedPlan.jobId} className="border-b border-[rgba(34,197,94,0.04)] hover:bg-[rgba(34,197,94,0.03)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{plan.jobSpec.name}</div>
                      <div className="text-[10px] text-[#4a6b4a]">Planned payload: {plan.jobSpec.workloadType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#86efac] font-mono text-xs">{plan.optimizedPlan.region.name}</div>
                      <div className="text-[10px] text-[#4a6b4a]">{plan.optimizedPlan.region.provider.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#22c55e]">{formatCO2(plan.optimizedPlan.co2SavedKg)}</div>
                      <div className="text-[10px] text-[#22c55e]">{plan.optimizedPlan.co2SavedPercent.toFixed(1)}% optimization</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-mono">{formatCurrency(plan.optimizedPlan.estimatedCostUSD)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="primary" 
                          className="h-8 px-3"
                          loading={executingId === plan.optimizedPlan.jobId}
                          onClick={() => handleExecute(plan.optimizedPlan.jobId)}
                        >
                          <Play className="w-3 h-3" /> Execute
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 w-8 p-0 border-[#ef444430] hover:bg-[#ef444410] hover:text-[#ef4444]"
                          onClick={() => removeFromQueue(plan.optimizedPlan.jobId)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Link href={`/plan/${plan.optimizedPlan.jobId}`}>
                           <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                             <ExternalLink className="w-3 h-3" />
                           </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Execution History */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(34,197,94,0.08)]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]">Execution History</h3>
            <p className="text-xs text-[#4a6b4a] mt-0.5">Verified carbon-aware completions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs text-[#4a6b4a]">No completed executions yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(34,197,94,0.06)]">
                  {["Job Name", "Region", "CO₂ Saved", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#4a6b4a]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((plan) => (
                  <tr key={plan.optimizedPlan.jobId} className="border-b border-[rgba(34,197,94,0.04)] hover:bg-[rgba(34,197,94,0.03)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{plan.jobSpec.name}</div>
                      <div className="text-[10px] text-[#4a6b4a]">Completed {formatDateTime(new Date().toISOString())}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#86efac] font-mono text-xs">{plan.optimizedPlan.region.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#22c55e]">{formatCO2(plan.optimizedPlan.co2SavedKg)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="green">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/plan/${plan.optimizedPlan.jobId}`} className="text-[#4a6b4a] hover:text-[#22c55e] transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
