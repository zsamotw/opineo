"use client";

import { useState } from "react";
import { Comment } from "../data/opinions";
import { useComments } from "../lib/useComments";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

interface CommentsAccordionProps {
  initialComments: Comment[];
  opinionId: string;
  selectedQuote?: string;
  onDisagreeChange?: (hasDisagree: boolean) => void;
  onClearSelectedQuote?: () => void;
}

export function CommentsAccordion({ 
  initialComments, 
  opinionId,
  selectedQuote: externalSelectedQuote,
  onDisagreeChange,
  onClearSelectedQuote,
}: CommentsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [internalSelectedQuote, setInternalSelectedQuote] = useState("");

  const selectedQuote = externalSelectedQuote ?? internalSelectedQuote;
  const setHasDisagree = (value: boolean) => {
    onDisagreeChange?.(value);
  };
  const clearSelectedQuote = onClearSelectedQuote ?? (() => setInternalSelectedQuote(""));

  const { comments, addComment, addReply, toggleReaction, toggleReplyReaction, userId } = useComments({
    initialComments,
    opinionId,
  });

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 dark:border-gray-700 dark:bg-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between p-3 text-lg font-medium text-gray-700 dark:text-gray-200"
      >
        <span>Komentarze ({comments.length})</span>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 px-3 pb-3 dark:border-gray-700">
          {!showCommentForm ? (
            <button
              onClick={() => setShowCommentForm(true)}
              className="mt-2 text-lg font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Odpowiedz
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowCommentForm(false)}
                className="mt-2 text-lg font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Ukryj formularz
              </button>
              <CommentForm
                onSubmit={addComment}
                commentCount={comments.length}
                selectedQuote={selectedQuote}
                onDisagreeChange={setHasDisagree}
                onClearSelectedQuote={clearSelectedQuote}
              />
            </>
          )}
          {comments.length > 0 && (
            <div className="mt-4">
              <CommentList
                comments={comments}
                onAddReply={addReply}
                onToggleReaction={toggleReaction}
                onToggleReplyReaction={toggleReplyReaction}
                userId={userId}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}