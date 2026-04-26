"use client";

import { useState } from "react";
import { QuoteIcon } from "./Icons";

interface SelectedQuotesProps {
  quotes: string[];
}

export function SelectedQuotes({ quotes }: SelectedQuotesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (quotes.length === 0) return null;

  return (
    <details
      open={isOpen}
      className="mt-4 cursor-pointer rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex list-none items-center justify-between p-3 text-base font-bold text-gray-900 dark:text-gray-100"
      >
        <span className="flex items-center gap-2">
          <QuoteIcon size={16} />
          Warte uwagi ({quotes.length})
        </span>
        <span className="transition-transform {isOpen ? 'rotate-180' : ''}">{isOpen ? "▼" : "▶"}</span>
      </summary>
      {isOpen && (
        <div className="p-3 pt-0">
          <ul className="list-disc pl-5 space-y-3">
            {quotes.map((quote, index) => (
              <li key={index} className="text-base leading-normal text-gray-700 dark:text-gray-300 italic">
                &ldquo;{quote}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}