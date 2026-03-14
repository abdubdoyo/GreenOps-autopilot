"use client";
import { cn } from "@/lib/utils";
import { HTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[rgba(34,197,94,0.1)] bg-[#0d1a0d] p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardValue({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-3xl font-bold text-white tabular-nums", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = "green" | "blue" | "yellow" | "red" | "ghost";

export function Badge({
  children,
  variant = "ghost",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const styles: Record<BadgeVariant, string> = {
    green: "bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[rgba(34,197,94,0.3)]",
    blue: "bg-[rgba(14,165,233,0.15)] text-[#0ea5e9] border border-[rgba(14,165,233,0.3)]",
    yellow: "bg-[rgba(234,179,8,0.15)] text-[#eab308] border border-[rgba(234,179,8,0.3)]",
    red: "bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[rgba(239,68,68,0.3)]",
    ghost: "bg-[rgba(255,255,255,0.06)] text-[#9ca3af] border border-[rgba(255,255,255,0.1)]",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[variant], className)}>
      {children}
    </span>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-[#22c55e] text-[#0a0f0a] hover:bg-[#16a34a] font-semibold",
      secondary: "bg-[rgba(34,197,94,0.1)] text-[#22c55e] border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.2)]",
      ghost: "bg-transparent text-[#6b8f6b] hover:text-white hover:bg-[rgba(255,255,255,0.05)]",
      danger: "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.2)]",
    };
    const sizes: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  max = 100,
  color = "#22c55e",
  className,
}: {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("h-2 w-full rounded-full bg-[#1a2e1a] overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-[rgba(34,197,94,0.1)]", className)} />;
}

// ─── Tooltip wrapper (simple) ─────────────────────────────────────────────────
export function Tooltip({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-[#1a2e1a] text-[#86efac] border border-[rgba(34,197,94,0.2)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {tip}
      </div>
    </div>
  );
}
