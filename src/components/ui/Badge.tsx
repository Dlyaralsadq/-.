import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("badge", variantStyles[variant], className)}>
      {children}
    </span>
  );
}

export function getAppointmentStatusVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    scheduled: "info",
    confirmed: "success",
    completed: "default",
    cancelled: "danger",
    noShow: "warning",
  };
  return map[status] ?? "default";
}
