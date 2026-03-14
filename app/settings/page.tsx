import { DashboardLayout } from "@/components/layout/Nav";
import { Card } from "@/components/ui";
import { Settings, Bell, Key, Globe, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-[#6b8f6b] mt-1">Configure GreenOps Autopilot for your team</p>
        </div>

        {[
          { icon: Key,     title: "API Keys",          desc: "Manage access tokens for the GreenOps REST API" },
          { icon: Globe,   title: "Default Regions",   desc: "Set preferred cloud regions and exclusion lists" },
          { icon: Bell,    title: "Notifications",     desc: "Configure alerts for savings milestones and job failures" },
          { icon: Shield,  title: "Compliance",        desc: "GDPR, data residency, and audit log retention settings" },
          { icon: Palette, title: "Appearance",        desc: "Theme, timezone, and display preferences" },
          { icon: Settings,title: "Optimizer Tuning",  desc: "Adjust weights for cost vs. carbon vs. speed tradeoffs" },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="flex items-center gap-4 cursor-pointer hover:border-[rgba(34,197,94,0.25)] transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="text-xs text-[#6b8f6b]">{desc}</div>
            </div>
            <div className="text-[#4a6b4a] group-hover:text-[#22c55e] transition-colors">›</div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
