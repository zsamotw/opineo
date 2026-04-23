"use client";

import { useState } from "react";
import { FlagIcon } from "./Icons";

interface OpposingViewsProps {
  opposingViews: string[];
}

export function OpposingViews({ opposingViews }: OpposingViewsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (opposingViews.length === 0) return null;

  return (
    <details
      open={isOpen}
      className="mt-4 cursor-pointer rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex list-none items-center justify-between p-4 text-lg font-medium text-orange-800 dark:text-orange-200"
      >
        <span className="flex items-center gap-2">
          <FlagIcon />
          Kontrapunkt ({opposingViews?.length ?? 0})
        </span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </summary>
      {isOpen && (
        <div className="p-4 pt-0">
          <ul className="list-disc pl-5 space-y-3">
            {opposingViews?.map((view, index) => (
              <li key={index} className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 italic">
                {view}
              </li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}