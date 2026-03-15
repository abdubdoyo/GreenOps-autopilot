import { PlanResponse } from "@/lib/types";

const QUEUE_KEY = "greenops_execution_queue";
const HISTORY_KEY = "greenops_execution_history";

export function getQueue(): PlanResponse[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(QUEUE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function addToQueue(plan: PlanResponse): void {
  const queue = getQueue();
  if (queue.find((p) => p.optimizedPlan.jobId === plan.optimizedPlan.jobId)) return;
  const newQueue = [...queue, plan];
  localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  // Dispatch event for reactive updates across components
  window.dispatchEvent(new Event("greenops_storage_update"));
}

export function removeFromQueue(jobId: string): void {
  const queue = getQueue();
  const newQueue = queue.filter((p) => p.optimizedPlan.jobId !== jobId);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  window.dispatchEvent(new Event("greenops_storage_update"));
}

export function getHistory(): PlanResponse[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(HISTORY_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function executeJob(jobId: string): void {
  const queue = getQueue();
  const job = queue.find((p) => p.optimizedPlan.jobId === jobId);
  if (!job) return;

  // Remove from queue
  const newQueue = queue.filter((p) => p.optimizedPlan.jobId !== jobId);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));

  // Add to history
  const history = getHistory();
  const newHistory = [job, ...history];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

  window.dispatchEvent(new Event("greenops_storage_update"));
}

export function isJobInQueue(jobId: string): boolean {
  return getQueue().some((p) => p.optimizedPlan.jobId === jobId);
}

export function isJobExecuted(jobId: string): boolean {
  return getHistory().some((p) => p.optimizedPlan.jobId === jobId);
}

export function clearAllData(): void {
  localStorage.removeItem(QUEUE_KEY);
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event("greenops_storage_update"));
}
