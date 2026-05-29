import { cn } from "@/lib/utils";

interface BadgeProps { children: React.ReactNode; variant?: "default"|"success"|"warning"|"danger"|"info"|"purple"|"yellow"; className?: string; }

const styles = {
  default: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  danger:  "bg-red-500/15 text-red-400 border border-red-500/25",
  info:    "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  purple:  "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  yellow:  "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return <span className={cn("badge", styles[variant], className)}>{children}</span>;
}

export function getAppointmentStatusVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    scheduled: "info", confirmed: "success", completed: "default",
    cancelled: "danger", noShow: "warning",
  };
  return map[status] ?? "default";
}
