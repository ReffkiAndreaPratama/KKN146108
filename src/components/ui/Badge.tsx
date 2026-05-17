import { cn } from "@/lib/utils";

type BadgeVariant = "emerald" | "cyan" | "violet" | "amber" | "red" | "pink" | "blue" | "slate" | "indigo" | "fuchsia" | "orange" | "rose";

const variantMap: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cyan:    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  violet:  "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  red:     "bg-red-500/10 text-red-400 border-red-500/20",
  pink:    "bg-pink-500/10 text-pink-400 border-pink-500/20",
  blue:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  slate:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
  indigo:  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  orange:  "bg-orange-500/10 text-orange-400 border-orange-500/20",
  rose:    "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  icon?: React.ElementType;
}

export function Badge({ children, variant = "emerald", size = "md", className, icon: Icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold border rounded-full",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        variantMap[variant],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

export function SectionBadge({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </div>
  );
}
