"use client";

import { useState } from "react";

interface AIAssistantProps {
  opinionContent?: string;
}

export function AIAssistant({ opinionContent = "" }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeOpinion = async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    setOut("Analizuję komentarz...");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: content }),
    });
    const data = await res.json();
    setOut(data.analysis || "Brak odpowiedzi.");
    setLoading(false);
  };

  const handleToggle = () => {
    if (!isOpen && opinionContent) {
      analyzeOpinion(opinionContent);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
      <button
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between p-3 text-sm font-medium text-purple-800 dark:text-purple-200"
      >
        <span>🤖 Analiza retoryczna</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
          {loading && (
            <p className="text-sm text-purple-600 dark:text-purple-400">Analizuję komentarz...</p>
          )}
          {out && (
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {out}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
