"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Clock, XCircle } from "lucide-react";
import { RECENT_PLANS } from "@/lib/mock-data/scenarios";
import { Badge } from "@/components/ui";

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: "#22c55e", variant: "green" as const },
  running:   { icon: Loader2,      color: "#0ea5e9", variant: "blue" as const },
  queued:    { icon: Clock,        color: "#eab308", variant: "yellow" as const },
  failed:    { icon: XCircle,      color: "#ef4444", variant: "red" as const },
};

export function RecentPlansTable() {
  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-[rgba(34,197,94,0.08)]">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]">Recent Plans</h3>
          <p className="text-xs text-[#4a6b4a] mt-0.5">Optimization decisions from the last 24h</p>
        </div>
        <Link
          href="/planner"
          className="text-xs text-[#22c55e] hover:text-[#86efac] flex items-center gap-1 transition-colors"
        >
          New job <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(34,197,94,0.06)]">
              {["Job Name", "Best Region", "CO₂ Saved", "Savings %", "Cost", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#4a6b4a]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_PLANS.map((plan, i) => {
              const st = STATUS_CONFIG[plan.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.completed;
              const Icon = st.icon;
              return (
                <tr
                  key={plan.id}
                  className="border-b border-[rgba(34,197,94,0.04)] hover:bg-[rgba(34,197,94,0.03)] transition-colors group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{plan.jobName}</div>
                    <div className="text-xs text-[#4a6b4a]">{plan.ts}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#86efac] font-mono text-xs">{plan.region}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-[#22c55e]">{plan.co2Saved} kg</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#1a2e1a] rounded-full w-16 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${plan.savedPct}%`,
                            backgroundColor: plan.savedPct > 90 ? "#22c55e" : plan.savedPct > 70 ? "#86efac" : "#eab308",
                          }}
                        />
                      </div>
                      <span className="text-xs text-[#86efac] font-mono">{plan.savedPct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-mono">${plan.cost.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={st.variant}>
                      <Icon className="w-3 h-3" style={plan.status === "running" ? { animation: "spin 1s linear infinite" } : {}} />
                      {plan.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/plan/${plan.id}`}
                      className="text-[#4a6b4a] hover:text-[#22c55e] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
