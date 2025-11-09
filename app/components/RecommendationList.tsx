"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import RecommendationRow from "./RecommendationRow";
import { FunnelIcon, BarsArrowUpIcon, BarsArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/app/lib/cn";
import RecommendationCard from "./RecommendationCard";
import RecommendationDetailsPanel from "./RecommendationDetailsPanel";
import CompletionToast from "./CompletionToast";
import { Recommendation } from "@/app/types/recommendation";
import { isHighImpact, isQuickTurnaround } from "@/app/lib/priority";
import { fetchRecommendations, updateRecommendation } from "@/app/lib/api";

const fetcher = async () => fetchRecommendations();

type SortField = "impactScore" | "estimatedTimeHours" | "fixes";
type SortDirection = "asc" | "desc";
type ViewMode = "table" | "card";

export default function RecommendationList() {
  const { data, error, isLoading, mutate } = useSWR<Recommendation[]>(
    "/api/recommendations",
    fetcher,
    {
      dedupingInterval: 5000,
      revalidateOnFocus: true,
      keepPreviousData: true,
    }
  );
  const recommendations = useMemo(() => data ?? [], [data]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed">("all");
  const [sortField, setSortField] = useState<SortField>("impactScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkSelectionIds, setBulkSelectionIds] = useState<string[]>([]);
  const [completionToast, setCompletionToast] = useState<{ count: number } | null>(null);
  const itemsPerPage = viewMode === "card" ? 12 : 20;
  const showBulkActionsBar = bulkSelectionIds.length > 0;

  const mergeCompletion = (list: Recommendation[] | undefined, ids: string[], completed: boolean) => {
    const set = new Set(ids);
    return (list ?? []).map((item) => (set.has(item.id) ? { ...item, completed } : item));
  };

  const mutateCompletion = async (ids: string[], completed: boolean) => {
    if (ids.length === 0) {
      return;
    }
    await mutate(
      async (current) => {
        await Promise.all(ids.map((id) => updateRecommendation(id, { completed })));
        return mergeCompletion(current, ids, completed);
      },
      {
        optimisticData: (current) => mergeCompletion(current ?? recommendations, ids, completed),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );
  };

  const handleBulkSelect = (id: string, selected: boolean) => {
    setBulkSelectionIds((prev) => {
      if (selected) {
        if (prev.includes(id)) {
          return prev;
        }
        return [...prev, id];
      }
      return prev.filter((existing) => existing !== id);
    });
  };

  const clearBulkSelection = () => setBulkSelectionIds([]);

  const handleBulkComplete = async () => {
    if (bulkSelectionIds.length === 0) {
      return;
    }
    await mutateCompletion(bulkSelectionIds, true);
    setCompletionToast({ count: bulkSelectionIds.length });
    setCurrentPage(1);
    clearBulkSelection();
  };

  const handleToggleCompletion = async (id: string, completed: boolean) => {
    await mutateCompletion([id], completed);
    if (completed) {
      setCompletionToast({ count: 1 });
      setCurrentPage(1);
      setSelectedId(null);
      setBulkSelectionIds((prev) => prev.filter((existing) => existing !== id));
    }
  };

  const handleSelectedMarkComplete = async () => {
    if (!selectedId) {
      return;
    }
    await mutateCompletion([selectedId], true);
    setCompletionToast({ count: 1 });
    setCurrentPage(1);
    setBulkSelectionIds((prev) => prev.filter((id) => id !== selectedId));
    setSelectedId(null);
  };

  const stats = useMemo(() => {
    const total = recommendations.length;
    const completed = recommendations.filter((r) => r.completed).length;
    const pending = recommendations.filter((r) => !r.completed).length;
    const avgImpact =
      pending > 0 ? Math.round(recommendations.reduce((sum, r) => sum + (r.completed ? 0 : r.impactScore), 0) / pending) : 0;
    const highImpactCount = recommendations.filter((r) => isHighImpact(r) && !r.completed).length;
    const quickTurnaroundCount = recommendations.filter((r) => isQuickTurnaround(r) && !r.completed).length;

    return { total, completed, pending, avgImpact, highImpactCount, quickTurnaroundCount };
  }, [recommendations]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...recommendations];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((r) => 
        r.productName.toLowerCase().includes(query) ||
        r.skus.some((sku) => sku.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filter === "completed") {
      filtered = filtered.filter((r) => r.completed);
    } else {
      filtered = filtered.filter((r) => !r.completed);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortField === "fixes") {
        aValue = a.fixes.length;
        bValue = b.fixes.length;
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (sortDirection === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [recommendations, filter, sortField, sortDirection, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const selectedItem = useMemo<Recommendation | null>(() => {
    if (!selectedId) {
      return null;
    }
    return recommendations.find((rec) => rec.id === selectedId) ?? null;
  }, [recommendations, selectedId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const handleFilterChange = (nextFilter: "all" | "completed") => {
    setFilter(nextFilter);
    setCurrentPage(1);
  };

  const handleViewToggle = (nextMode: ViewMode) => {
    setViewMode(nextMode);
    setCurrentPage(1);
    if (nextMode !== "card" && bulkSelectionIds.length > 0) {
      setBulkSelectionIds([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-slate-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-8 py-16 text-center">
        <p className="text-base font-semibold text-rose-600">We hit a snag</p>
        <p className="mt-2 max-w-sm text-sm text-rose-500">
          {error.message}. Your list might be out of sync with the server.
        </p>
        <button
          type="button"
          onClick={() => mutate()}
          className="mt-6 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completionToast && (
        <div className="pointer-events-none fixed right-6 top-24 z-20 flex flex-col gap-3">
          <CompletionToast
            count={completionToast.count}
            onDismiss={() => setCompletionToast(null)}
          />
        </div>
      )}
      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">High Impact</div>
          <div className="text-2xl font-bold text-gray-900">{stats.highImpactCount}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Impact score ≥ 80</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Avg Impact</div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgImpact}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Quick turnarounds: {stats.quickTurnaroundCount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or SKUs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none text-sm text-gray-900 bg-white placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" aria-hidden />
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
              {(["all", "completed"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleFilterChange(option)}
                  aria-pressed={filter === option}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    filter === option
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => handleViewToggle("table")}
              aria-pressed={viewMode === "table"}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => handleViewToggle("card")}
              aria-pressed={viewMode === "card"}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewMode === "card"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {paginatedData.length} of {filteredAndSortedData.length} recommendations
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {showBulkActionsBar && (
        <div
          className={cn(
            "sticky z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/95 px-4 py-3 backdrop-blur",
            viewMode === "card" ? "top-0 lg:top-0" : "top-0"
          )}
        >
          <div className="text-sm font-semibold text-slate-700">
            {bulkSelectionIds.length} selected
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkComplete}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Mark selected complete
            </button>
            <button
              type="button"
              onClick={clearBulkSelection}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "table" ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-gray-50/50 border-b border-gray-200 items-center">
          <div className="col-span-6 flex items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              Product
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button
              onClick={() => handleSort("impactScore")}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900"
            >
              Impact
              {sortField === "impactScore" && (
                sortDirection === "desc" ? <BarsArrowDownIcon className="w-3 h-3" /> : <BarsArrowUpIcon className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button
              onClick={() => handleSort("estimatedTimeHours")}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900"
            >
              Time
              {sortField === "estimatedTimeHours" && (
                sortDirection === "desc" ? <BarsArrowDownIcon className="w-3 h-3" /> : <BarsArrowUpIcon className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button
              onClick={() => handleSort("fixes")}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900"
            >
              Fixes
              {sortField === "fixes" && (
                sortDirection === "desc" ? <BarsArrowDownIcon className="w-3 h-3" /> : <BarsArrowUpIcon className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
          </div>
        </div>

        {/* Table Rows */}
        {paginatedData.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="text-gray-400 text-sm">
              {searchQuery ? `No recommendations found matching "${searchQuery}"` : "No recommendations found"}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedData.map((rec) => (
              <RecommendationRow
                key={rec.id}
                item={rec}
                onToggleAction={handleToggleCompletion}
                onBulkSelectAction={handleBulkSelect}
                isBulkSelected={bulkSelectionIds.includes(rec.id)}
                isSelected={selectedId === rec.id}
                onSelectAction={() => setSelectedId(selectedId === rec.id ? null : rec.id)}
              />
            ))}
          </div>
        )}
        </div>
      ) : (
        <div className="space-y-4">
          {(() => {
            const cardsGrid = (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedData.length === 0 ? (
                  <div className="col-span-full rounded-lg border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
                    {searchQuery ? `No recommendations found matching "${searchQuery}"` : "No recommendations found"}
                  </div>
                ) : (
                  paginatedData.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      item={rec}
                      onSelectAction={() => setSelectedId(selectedId === rec.id ? null : rec.id)}
                      onBulkSelectAction={handleBulkSelect}
                      isBulkSelected={bulkSelectionIds.includes(rec.id)}
                      isSelected={selectedId === rec.id}
                    />
                  ))
                )}
              </div>
            );

            if (!selectedItem) {
              return cardsGrid;
            }

            return (
              <div
                className={cn(
                  "grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
                  showBulkActionsBar && "lg:mt-16"
                )}
              >
            <div className="grid gap-4 md:grid-cols-2">
                  {paginatedData.length === 0 ? (
                    <div className="col-span-full rounded-lg border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
                      {searchQuery ? `No recommendations found matching "${searchQuery}"` : "No recommendations found"}
                    </div>
                  ) : (
                    paginatedData.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        item={rec}
                        onSelectAction={() => setSelectedId(selectedId === rec.id ? null : rec.id)}
                        onBulkSelectAction={handleBulkSelect}
                        isBulkSelected={bulkSelectionIds.includes(rec.id)}
                        isSelected={selectedId === rec.id}
                      />
                    ))
                  )}
                </div>
                <RecommendationDetailsPanel
                  item={selectedItem}
                  onClose={() => setSelectedId(null)}
                  onMarkComplete={handleSelectedMarkComplete}
                  className={cn(
                    "hidden lg:block lg:sticky lg:max-h-[calc(100vh-100px)]",
                viewMode === "card" && showBulkActionsBar ? "lg:top-[100px]" : "lg:top-6"
                  )}
                />
              </div>
            );
          })()}

          {selectedItem && (
            <RecommendationDetailsPanel
              item={selectedItem}
              onClose={() => setSelectedId(null)}
              onMarkComplete={handleSelectedMarkComplete}
              className="lg:hidden"
            />
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
