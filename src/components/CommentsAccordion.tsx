"use client";

import { useState } from "react";
import { Comment } from "../data/opinions";
import { CommentReply } from "../data/opinions";
import { useCountdownForm } from "../lib/useCountdownForm";
import { CountdownIndicator } from "./CountdownIndicator";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { ChatBubbleIcon } from "./Icons";
import { ReactionType } from "../types/reaction";

interface CommentsAccordionProps {
  comments: Comment[];
  opinionId: string;
  selectedQuote?: string;
  onDisagreeChange?: (hasDisagree: boolean) => void;
  onClearSelectedQuote?: () => void;
  onAddComment: (comment: Omit<Comment, "replies" | "reactions">) => Promise<void>;
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => Promise<void>;
  onToggleReaction: (commentId: string, type: ReactionType) => Promise<void>;
  onToggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => Promise<void>;
  userId?: string;
}

export function CommentsAccordion({ 
  comments,
  opinionId,
  selectedQuote: externalSelectedQuote,
  onDisagreeChange,
  onClearSelectedQuote,
  onAddComment,
  onAddReply,
  onToggleReaction,
  onToggleReplyReaction,
  userId,
}: CommentsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedQuote, setInternalSelectedQuote] = useState("");

  const { showForm: showCommentForm, countdown, openForm: handleOpenCommentForm, closeForm: handleCloseCommentForm } = useCountdownForm();

  const selectedQuote = externalSelectedQuote ?? internalSelectedQuote;
  const setHasDisagree = (value: boolean) => {
    onDisagreeChange?.(value);
  };
  const clearSelectedQuote = onClearSelectedQuote ?? (() => setInternalSelectedQuote(""));

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between p-4 text-lg font-medium text-gray-700 dark:text-gray-200"
      >
        <span className="flex items-center gap-2">
          <ChatBubbleIcon />
          Komentarze ({comments.length})
        </span>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 p-4 pt-3 dark:border-gray-700">
          {!showCommentForm ? (
            <>
              <button
                onClick={handleOpenCommentForm}
                disabled={countdown > 0}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline disabled:cursor-wait disabled:no-underline dark:text-blue-400 sm:text-lg"
              >
                Odpowiedz
              </button>
              <CountdownIndicator countdown={countdown} />
            </>
          ) : (
            <>
              <button
                onClick={handleCloseCommentForm}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 sm:text-lg"
              >
                Ukryj formularz
              </button>
              <CommentForm
                onSubmit={onAddComment}
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
                onAddReply={onAddReply}
                onToggleReaction={onToggleReaction}
                onToggleReplyReaction={onToggleReplyReaction}
                userId={userId}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}