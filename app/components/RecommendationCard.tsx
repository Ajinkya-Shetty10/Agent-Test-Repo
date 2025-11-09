"use client";
import { useState } from "react";
import { Recommendation } from "@/app/types/recommendation";
import { isHighImpact, isQuickTurnaround } from "@/app/lib/priority";
import { getImpactColorClasses } from "@/app/lib/impactColors";
import Image from "next/image";
import { cn } from "@/app/lib/cn";
import PriorityTag from "./PriorityTag";

interface RecommendationCardProps {
  item: Recommendation;
  onSelectAction: () => void;
  onBulkSelectAction: (id: string, selected: boolean) => void;
  isBulkSelected: boolean;
  isSelected: boolean;
}

export default function RecommendationCard({
  item,
  onSelectAction,
  onBulkSelectAction,
  isBulkSelected,
  isSelected,
}: RecommendationCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const highImpact = isHighImpact(item);
  const quickTurnaround = isQuickTurnaround(item);
  const extraSkuCount = Math.max(0, item.skus.length - 2);
  const { trackClass, fillClass } = getImpactColorClasses(item.impactScore);
  const derivedTags: Array<"highImpact" | "quickWin"> = [];
  if (highImpact) {
    derivedTags.push("highImpact");
  }
  if (quickTurnaround) {
    derivedTags.push("quickWin");
  }

  const handleCompletionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onBulkSelectAction(item.id, event.target.checked);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectAction();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelectAction}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-2xl border px-6 py-6 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        item.completed
          ? "border-slate-200 bg-slate-50"
          : isSelected
          ? "border-slate-500 bg-slate-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {hasImageError ? (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase tracking-wide text-slate-400">
              No image
            </div>
          ) : (
            <Image
              src={item.productImage}
              alt={item.productName}
              fill
              sizes="96px"
              className={cn("object-cover transition-opacity", item.completed && "opacity-60")}
              onError={() => setHasImageError(true)}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-md font-semibold text-slate-900",
              item.completed && "line-through"
            )}
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {item.productName}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.skus.slice(0, 2).map((sku) => (
              <span key={sku} className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
                {sku}
              </span>
            ))}
            {extraSkuCount > 0 && (
              <span className="text-[11px] font-medium text-slate-500">+{extraSkuCount}</span>
            )}
          </div>
          {derivedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {derivedTags.map((tagKey) => (
                <PriorityTag
                  key={tagKey}
                  variant={tagKey}
                  label={tagKey === "highImpact" ? "High impact" : "Quick win"}
                />
              ))}
            </div>
          )}
        </div>
        <label onClick={(event) => event.stopPropagation()} className="ml-auto mt-1">
          <input
            type="checkbox"
            checked={isBulkSelected}
            onChange={handleCompletionChange}
            disabled={item.completed}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-700 focus:ring-1 focus:ring-slate-400"
            aria-label={isBulkSelected ? "Deselect recommendation" : "Select recommendation for bulk actions"}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 items-center justify-center">
            <span className="text-2xl font-medium text-slate-900 leading-none">{item.fixes.length}</span>
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Fixes</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 items-center justify-center">
            <span className="text-2xl font-medium text-slate-900 leading-none">{item.estimatedTimeHours}h</span>
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Completion Time</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 items-center justify-center">
            <div className="relative h-16 w-24">
              <svg className="h-16 w-24" viewBox="0 0 96 48" aria-hidden>
                <path
                  d="M8 40 A40 40 0 0 1 88 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className={trackClass}
                />
                <path
                  d="M8 40 A40 40 0 0 1 88 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={cn(fillClass, "transition-all duration-500")}
                  strokeDasharray={Math.PI * 40}
                  strokeDashoffset={(Math.PI * 40) * (1 - item.impactScore / 100)}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-medium text-slate-900 leading-none">
                {item.impactScore}
              </span>
            </div>
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Impact Score</div>
        </div>
      </div>

      <div className="mt-auto w-full">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelectAction();
          }}
          className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          View Fixes
        </button>
      </div>
    </article>
  );
}

