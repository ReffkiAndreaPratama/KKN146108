import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="w-8 h-8 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.07] space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/[0.06]" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-white/[0.06] rounded-full w-3/4" />
          <div className="h-3 bg-white/[0.04] rounded-full w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-white/[0.04] rounded-full" />
      <div className="h-3 bg-white/[0.04] rounded-full w-5/6" />
      <div className="h-2 bg-white/[0.06] rounded-full mt-4" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05] animate-pulse">
      <div className="w-8 h-8 rounded-xl bg-white/[0.06] shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-white/[0.06] rounded-full w-1/3" />
        <div className="h-3 bg-white/[0.04] rounded-full w-1/4" />
      </div>
      <div className="h-5 w-16 bg-white/[0.06] rounded-full" />
    </div>
  );
}
