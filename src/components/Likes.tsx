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
      className="mt-4 cursor-pointer rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex list-none items-center justify-between p-4 text-lg font-medium text-green-800 dark:text-green-200"
      >
        <span>✓ Inni cenią ({likes?.length ?? 0})</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </summary>
      {isOpen && (
        <div className="p-4 pt-0">
          <ul className="list-disc pl-5 space-y-3">
            {likes?.map((like, index) => (
              <li key={index} className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 italic">
                {like}
              </li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}