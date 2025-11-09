"use client";
import { useCallback, useState } from "react";
import { Recommendation } from "@/app/types/recommendation";
import { ClockIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { isHighImpact, isQuickTurnaround } from "@/app/lib/priority";
import { cn } from "@/app/lib/cn";
import { getImpactColorClasses } from "@/app/lib/impactColors";
import PriorityTag from "./PriorityTag";

interface Props {
  item: Recommendation;
  onToggleAction: (id: string, completed: boolean) => void;
  onBulkSelectAction: (id: string, selected: boolean) => void;
  isBulkSelected: boolean;
  isSelected: boolean;
  onSelectAction: () => void;
}

export default function RecommendationRow({
  item,
  onToggleAction,
  onBulkSelectAction,
  isBulkSelected,
  isSelected,
  onSelectAction,
}: Props) {
  const [hasImageError, setHasImageError] = useState(false);
  const highImpact = isHighImpact(item);
  const quickTurnaround = isQuickTurnaround(item);
  const { trackClass, fillClass } = getImpactColorClasses(item.impactScore);
  const handleMarkCompleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (item.completed) {
      return;
    }
    onToggleAction(item.id, true);
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };
  const priorityTags: Array<{ variant: "highImpact" | "quickWin"; label: string }> = [];
  if (!item.completed && highImpact) {
    priorityTags.push({ variant: "highImpact", label: "High impact" });
  }
  if (!item.completed && quickTurnaround) {
    priorityTags.push({ variant: "quickWin", label: "Quick win" });
  }

  const handleRowKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelectAction();
      }
    },
    [onSelectAction]
  );

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onBulkSelectAction(item.id, event.target.checked);
    },
    [item.id, onBulkSelectAction]
  );

  return (
    <>
      <div
        onClick={onSelectAction}
        onKeyDown={handleRowKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isSelected}
        className={cn(
          "grid grid-cols-12 items-center gap-3 px-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          item.completed
            ? "cursor-pointer bg-slate-50 opacity-60"
            : isSelected
            ? "cursor-pointer border-l-2 border-slate-500 bg-slate-50"
            : "cursor-pointer bg-white hover:bg-slate-50"
        )}
      >
        {/* Product */}
        <div className="col-span-6 flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 flex-shrink-0">
            {hasImageError ? (
              <div className="flex h-full w-full items-center justify-center rounded border border-gray-200 bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                No image
              </div>
            ) : (
              <Image
                src={item.productImage}
                alt={item.productName}
                width={44}
                height={44}
                className="h-full w-full rounded border border-gray-200 object-cover"
                onError={() => setHasImageError(true)}
              />
            )}
            {item.completed && (
              <div className="absolute inset-0 rounded bg-white/80 flex items-center justify-center">
                <CheckCircleIconSolid className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "truncate text-sm font-medium text-slate-900",
                item.completed && "line-through"
              )}
            >
              {item.productName}
            </div>
            {priorityTags.length > 0 && (
              <div className="mt-1 flex items-center gap-1.5">
                {priorityTags.map((tag) => (
                  <PriorityTag key={tag.variant} variant={tag.variant} label={tag.label} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Impact Score */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className={trackClass}
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className={cn(fillClass, "transition-all duration-700 ease-out")}
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - item.impactScore / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">{item.impactScore}</span>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="col-span-1 flex items-center justify-center">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <ClockIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{item.estimatedTimeHours}h</span>
          </div>
        </div>

        {/* Fixes Count */}
        <div className="col-span-1 flex items-center justify-center">
          <span className="text-sm text-gray-900">{item.fixes.length}</span>
        </div>

        {/* Actions */}
        <div className="col-span-1 flex items-center justify-center gap-1.5">
          <label
            className="cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            title={item.completed ? "Completed recommendations cannot be selected" : "Select recommendation for bulk actions"}
          >
            <input
              type="checkbox"
              checked={isBulkSelected}
              onChange={handleCheckboxChange}
              disabled={item.completed}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-700 focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed"
              aria-label={isBulkSelected ? "Deselect recommendation" : "Select recommendation for bulk actions"}
            />
          </label>
          <div
            className="p-1 rounded transition-all"
            title={isSelected ? "Collapse details" : "View details"}
          >
            <ChevronRightIcon 
              className={`w-3.5 h-3.5 text-gray-400 transition-all duration-200 ${
                isSelected ? 'rotate-90' : ''
              }`} 
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="bg-gray-50/50 border-t border-gray-200">
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-4">
              {/* Left Column - Recommended Fixes */}
        <div className="col-span-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Recommended Fixes ({item.fixes.length})
                </h4>
          <ul className="space-y-1">
                  {item.fixes.map((fix) => (
              <li
                      key={fix.id} 
                className="flex items-start gap-2"
                    >
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-gray-900">{fix.title}</p>
                  {fix.description && (
                    <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{fix.description}</p>
                  )}
                </div>
              </li>
                  ))}
          </ul>
              </div>

              {/* Right Column - Details & Actions */}
                <div className="col-span-1 space-y-3">
                {/* Product Details */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Product Details
                  </h4>
                  <div className="bg-white border border-gray-200 rounded p-3 space-y-3">
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1.5">All SKUs</div>
                      <div className="flex flex-wrap gap-1">
                        {item.skus.map((sku, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-mono rounded"
                          >
                            {sku}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact & Time Summary */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Summary
                  </h4>
                  <div className="bg-white border border-gray-200 rounded p-3 space-y-3">
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1.5">Impact Score</div>
                      <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12">
                          <svg className="transform -rotate-90 w-12 h-12">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              className={trackClass}
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeLinecap="round"
                              className={cn(fillClass, "transition-all duration-700")}
                              strokeDasharray={`${2 * Math.PI * 20}`}
                              strokeDashoffset={`${2 * Math.PI * 20 * (1 - item.impactScore / 100)}`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">{item.impactScore}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">
                            Impact Score
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {item.estimatedTimeHours}h estimated
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleMarkCompleteClick}
                    onKeyDown={handleButtonKeyDown}
                    disabled={item.completed}
                    className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    {item.completed ? "Already completed" : "Mark complete"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
