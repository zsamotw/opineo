"use client";

import { Comment } from "../data/opinions";
import { AIAssistant } from "./AIAssistant";
import { Likes } from "./Likes";
import { SelectedQuotes } from "./SelectedQuotes";

interface ResumeProps {
  comments: Comment[];
}

export function Resume({ comments }: ResumeProps) {
  const selectedQuotes = comments
    .filter((c) => c.selectedQuote?.trim())
    .map((c) => c.selectedQuote!);

  const likes = comments
    .filter((c) => c.agree && c.disagree)
    .map((c) => c.agree);

  if (selectedQuotes.length === 0 && likes.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <SelectedQuotes quotes={selectedQuotes} />
      <Likes likes={likes} />
      <AIAssistant />
    </div>
  );
}