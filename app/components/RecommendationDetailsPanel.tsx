"use client";
import { useState } from "react";
import { Recommendation } from "@/app/types/recommendation";
import { isHighImpact, isQuickTurnaround } from "@/app/lib/priority";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { cn } from "@/app/lib/cn";
import PriorityTag from "./PriorityTag";

interface RecommendationDetailsPanelProps {
  item?: Recommendation | null;
  className?: string;
  onClose?: () => void;
  onMarkComplete?: () => void;
}

export default function RecommendationDetailsPanel({ item, className, onClose, onMarkComplete }: RecommendationDetailsPanelProps) {
  if (!item) {
    return (
      <aside className={cn("rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500", className)}>
        <p className="font-medium text-slate-900">Select a recommendation</p>
        <p className="mt-1">Choose a card to see the full set of fixes and context.</p>
      </aside>
    );
  }

  const [hasImageError, setHasImageError] = useState(false);
  const highImpact = isHighImpact(item);
  const quickTurnaround = isQuickTurnaround(item);

  return (
    <aside
      className={cn(
        "relative flex max-h-[calc(100vh-180px)] flex-col overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm self-start",
        className
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-200 p-1 text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          aria-label="Close details"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {hasImageError ? (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-slate-400">
              No image
            </div>
          ) : (
            <Image
              src={item.productImage}
              alt={item.productName}
              fill
              sizes="64px"
              className="object-cover"
              onError={() => setHasImageError(true)}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900">{item.productName}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {item.skus.slice(0, 3).map((sku) => (
              <span key={sku} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600">
                {sku}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-600">
            {highImpact && <PriorityTag variant="highImpact" label="High impact" />}
            {quickTurnaround && <PriorityTag variant="quickWin" label="Quick win" />}
            {item.completed && <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-600">Completed</span>}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Impact score</span>
          <span className="text-base font-semibold text-slate-900">{item.impactScore}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated time</span>
          <div className="flex items-center gap-1 text-base font-semibold text-slate-900">
            <ClockIcon className="h-4 w-4 text-slate-400" aria-hidden />
            <span>{item.estimatedTimeHours}h</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recommended fixes ({item.fixes.length})
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {item.fixes.map((fix) => (
            <li key={fix.id} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" aria-hidden />
              <div>
                <p className="font-medium text-slate-900">{fix.title}</p>
                {fix.description && <p className="mt-1 text-xs text-slate-600">{fix.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {onMarkComplete && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onMarkComplete}
            disabled={item.completed}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {item.completed ? "Already completed" : "Mark complete"}
          </button>
        </div>
      )}
    </aside>
  );
}
