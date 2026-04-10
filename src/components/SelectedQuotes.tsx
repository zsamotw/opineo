"use client";

import { useState } from "react";

interface SelectedQuotesProps {
  quotes: string[];
}

export function SelectedQuotes({ quotes }: SelectedQuotesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (quotes.length === 0) return null;

  return (
    <details
      open={isOpen}
      className="mt-4 cursor-pointer rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex list-none items-center justify-between text-sm font-medium text-yellow-800 dark:text-yellow-200"
      >
        <span>❝ Fragmenty warte uwagi ({quotes.length})</span>
        <span className="transition-transform {isOpen ? 'rotate-180' : ''}">{isOpen ? "▼" : "▶"}</span>
      </summary>
      {isOpen && (
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {quotes.map((quote, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 italic">
              &ldquo;{quote}&rdquo;
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}