"use client";

import { useState } from "react";

interface AIAssistantProps {
  initialPrompt?: string;
}

export function AIAssistant({ initialPrompt = "Jaka dziś pogoda" }: AIAssistantProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isOpen, setIsOpen] = useState(false);
  const [out, setOut] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setOut("Generowanie...");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setOut(JSON.stringify(data, null, 2));
  };

  return (
    <details
      open={isOpen}
      className="mt-4 cursor-pointer rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex list-none items-center justify-between text-sm font-medium text-purple-800 dark:text-purple-200"
      >
        <span>🤖 Asystent AI</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </summary>
      {isOpen && (
        <form onSubmit={send} className="mt-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full rounded border border-purple-300 px-2 py-1 text-sm dark:bg-purple-900/30"
          />
          <button
            type="submit"
            className="mt-2 rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
          >
            Wyślij
          </button>
          {out && (
            <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {out}
            </pre>
          )}
        </form>
      )}
    </details>
  );
}