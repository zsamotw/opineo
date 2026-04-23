"use client";

import { Comment } from "../data/opinions";
import { AIAssistant } from "./AIAssistant";
import { Likes } from "./Likes";
import { SelectedQuotes } from "./SelectedQuotes";
import { useAIAnalysis } from "../lib/useAIAnalysis";

interface ResumeProps {
  comments: Comment[];
  opinionContent?: string;
}

export function Resume({ comments, opinionContent }: ResumeProps) {
  const { response, loading, error, analyzed, analyze } = useAIAnalysis();

  const selectedQuotes = comments
    .filter((comment) => comment.selectedQuote?.trim())
    .map((comment) => comment.selectedQuote!);

  const likes = comments
    .filter((comment) => comment.agree?.trim())
    .map((comment) => comment.agree);

  return (
    <div className="mt-4 space-y-2">
      {selectedQuotes.length > 0 && <SelectedQuotes quotes={selectedQuotes} />}
      {likes.length > 0 && <Likes likes={likes} />}
      <AIAssistant
        opinionContent={opinionContent}
        response={response}
        loading={loading}
        error={error}
        analyzed={analyzed}
        onAnalyze={analyze}
      />
    </div>
  );
}