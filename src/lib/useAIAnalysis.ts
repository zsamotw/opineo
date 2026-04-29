"use client";

import { useState, useCallback } from "react";

interface UseAIAnalysisResult {
  response: string | undefined;
  loading: boolean;
  error: string | undefined;
  analyzed: boolean;
  analyze: (content: string) => Promise<void>;
}

export function useAIAnalysis(): UseAIAnalysisResult {
  const [response, setResponse] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = useCallback(async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: content }),
      });
      const data = await res.json();
      if (data.analysis) {
        setResponse(data.analysis);
        setAnalyzed(true);
      } else {
        setError("Brak analizy.");
      }
    } catch {
      setError("Błąd pobierania analizy.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, error, analyzed, analyze };
}