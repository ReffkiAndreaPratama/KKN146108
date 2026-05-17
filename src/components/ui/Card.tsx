import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ children, className, padding = "lg", hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#111827] border border-white/[0.07]",
        paddingMap[padding],
        hover && "hover:border-white/[0.12] transition-colors duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  iconColor = "text-emerald-400",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && <Icon className={cn("w-4 h-4 shrink-0", iconColor)} />}
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-sm leading-tight">{title}</h3>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
