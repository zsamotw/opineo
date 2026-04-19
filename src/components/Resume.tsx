"use client";

import { useState } from "react";
import { Comment } from "../data/opinions";
import { AIAssistant } from "./AIAssistant";
import { Likes } from "./Likes";
import { SelectedQuotes } from "./SelectedQuotes";

interface ResumeProps {
  comments: Comment[];
  opinionContent?: string;
}

export function Resume({ comments, opinionContent }: ResumeProps) {
  const [aiResponse, setAiResponse] = useState<string | undefined>(undefined);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | undefined>(undefined);
  const [analyzed, setAnalyzed] = useState(false);

  const selectedQuotes = comments
    .filter((comment) => comment.selectedQuote?.trim())
    .map((comment) => comment.selectedQuote!);

  const likes = comments
    .filter((comment) => comment.agree && comment.disagree)
    .map((comment) => comment.agree);

  const analyzeOpinion = async (content: string) => {
    if (!content.trim() || analyzed) return;
    setAnalyzed(true);
    setAiLoading(true);
    setAiError(undefined);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: content }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiResponse(data.analysis);
      } else {
        setAiError("Brak analizy.");
      }
    } catch {
      setAiError("Błąd pobierania analizy.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {selectedQuotes.length > 0 && <SelectedQuotes quotes={selectedQuotes} />}
      {likes.length > 0 && <Likes likes={likes} />}
      <AIAssistant
        opinionContent={opinionContent}
        response={aiResponse}
        loading={aiLoading}
        error={aiError}
        analyzed={analyzed}
        onAnalyze={analyzeOpinion}
      />
    </div>
  );
}