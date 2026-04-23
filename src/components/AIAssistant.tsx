"use client";

import { useState } from "react";
import { SearchIcon } from "./Icons";

interface AIAssistantProps {
  opinionContent?: string;
  response?: string | undefined;
  loading?: boolean;
  error?: string | undefined;
  analyzed?: boolean;
  onAnalyze?: (content: string) => void;
}

export function AIAssistant({
  opinionContent = "",
  response,
  loading = false,
  error,
  analyzed = false,
  onAnalyze,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isOpen && opinionContent && !analyzed && onAnalyze) {
      onAnalyze(opinionContent);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
      <button
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between text-lg font-medium text-purple-800 dark:text-purple-200"
      >
        <span className="flex items-center gap-2">
          <SearchIcon />
          Analiza argumentacji
        </span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>
      {isOpen && (
        <div className="mt-3">
          {loading && (
            <p className="text-lg text-purple-600 dark:text-purple-400">Analizuję komentarz...</p>
          )}
          {error && (
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          )}
          {response && (
            <pre className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {response}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
