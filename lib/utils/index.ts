import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  // Simple class merging without tailwind-merge to avoid import issues
  return clsx(inputs);
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  if (kg < 1) return `${(kg * 1000).toFixed(0)}g`;
  return `${kg.toFixed(1)}kg`;
}

export function formatCurrency(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatPercent(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h > 24) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

export function getCarbonLabel(intensity: number): { label: string; color: string } {
  if (intensity < 50) return { label: "Very Clean", color: "#22c55e" };
  if (intensity < 150) return { label: "Clean", color: "#86efac" };
  if (intensity < 300) return { label: "Moderate", color: "#eab308" };
  if (intensity < 400) return { label: "Dirty", color: "#f97316" };
  return { label: "Very Dirty", color: "#ef4444" };
}

export function getProviderColor(provider: "aws" | "gcp" | "azure"): string {
  const colors = { aws: "#f97316", gcp: "#3b82f6", azure: "#0ea5e9" };
  return colors[provider];
}

export function co2ToCarEquivalent(kg: number): string {
  const km = (kg / 0.244).toFixed(0);
  return `${Number(km).toLocaleString()} km driven`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    completed: "#22c55e",
    running: "#0ea5e9",
    queued: "#eab308",
    failed: "#ef4444",
  };
  return map[status] ?? "#6b7280";
}
