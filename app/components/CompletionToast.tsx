"use client";

import { useEffect } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/app/lib/cn";

interface CompletionToastProps {
  count: number;
  onDismiss: () => void;
  className?: string;
}

const CompletionToast = ({ count, onDismiss, className }: CompletionToastProps) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-md",
        className
      )}
    >
      <span className="mt-0.5 text-primary">
        <CheckCircleIcon className="h-5 w-5 text-primary" aria-hidden />
      </span>
      <div className="flex-1 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Marked complete</p>
        <p className="mt-0.5">
          {count === 1 ? "1 recommendation" : `${count} recommendations`} updated in the completed tab.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss completion message"
        className="rounded-md p-1 text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <XMarkIcon className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
};

export default CompletionToast;

