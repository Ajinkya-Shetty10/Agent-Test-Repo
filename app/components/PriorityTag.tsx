"use client";

import { cn } from "@/app/lib/cn";
import { BoltIcon, SparklesIcon } from "@heroicons/react/24/solid";

type PriorityTagVariant = "highImpact" | "quickWin";

const variantStyles: Record<PriorityTagVariant, string> = {
  highImpact: "border-emerald-200 bg-emerald-100 text-emerald-700",
  quickWin: "border-sky-200 bg-sky-100 text-sky-700",
};

const iconMap: Record<PriorityTagVariant, typeof BoltIcon> = {
  highImpact: BoltIcon,
  quickWin: SparklesIcon,
};

interface PriorityTagProps {
  variant: PriorityTagVariant;
  label: string;
  className?: string;
}

const PriorityTag = ({ variant, label, className }: PriorityTagProps) => {
  const Icon = iconMap[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide transition",
        variantStyles[variant],
        className
      )}
      aria-label={label}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
};

export default PriorityTag;

