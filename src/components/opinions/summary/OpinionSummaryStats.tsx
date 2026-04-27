"use client";

import { HeartIcon, ContraIcon, QuoteIcon } from "@/src/components/Icons";
import { OpinionSummary } from "@/src/data/opinions";

interface OpinionSummaryStatsProps {
  summary: OpinionSummary;
}

export function OpinionSummaryStats({ summary }: OpinionSummaryStatsProps) {
  return (
    <div className="flex items-center gap-4 mt-3 text-sm">
      <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
        <HeartIcon size={14} />
        <span className="font-medium">{summary.agreeCount}</span>
      </div>
      <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400">
        <ContraIcon size={14} />
        <span className="font-medium">{summary.disagreeCount}</span>
      </div>
      {summary.quotes.length > 0 && (
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <QuoteIcon size={14} />
          <span className="font-medium">{summary.quotes.length}</span>
        </div>
      )}
    </div>
  );
}