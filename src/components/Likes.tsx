"use client";

import { useState } from "react";

interface LikesProps {
  likes: string[];
}

export function Likes({ likes }: LikesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (likes.length === 0) return null;

  return (
    <details
      open={isOpen}
      className="mt-4 cursor-pointer rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex list-none items-center justify-between text-sm font-medium text-green-800 dark:text-green-200"
      >
        <span>✓ Adwersarze cenią ({likes?.length ?? 0})</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </summary>
      {isOpen && (
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {likes?.map((like, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 italic">
              {like}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}