"use client";

import { useState, useEffect } from "react";
import { Comment, CommentReply } from "../data/opinions";
import { useCountdownForm } from "../lib/useCountdownForm";
import { CountdownIndicator } from "./CountdownIndicator";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { ChatBubbleIcon } from "./Icons";
import { ReactionType } from "../types/reaction";

interface CommentsAccordionProps {
  comments: Comment[];
  selectedQuote?: string;
  onClearSelectedQuote?: () => void;
  onAddComment: (comment: Omit<Comment, "replies" | "reactions">) => Promise<void>;
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => Promise<void>;
  onToggleReaction: (commentId: string, type: ReactionType) => Promise<void>;
  onToggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => Promise<void>;
  userId?: string;
  isCommentFormOpen?: boolean;
  onCommentFormOpenChange?: (isOpen: boolean) => void;
}

export function CommentsAccordion({ 
  comments,
  selectedQuote: externalSelectedQuote,
  onClearSelectedQuote,
  onAddComment,
  onAddReply,
  onToggleReaction,
  onToggleReplyReaction,
  userId,
  isCommentFormOpen: externalIsCommentFormOpen,
  onCommentFormOpenChange,
}: CommentsAccordionProps) {
const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedQuote, setInternalSelectedQuote] = useState("");
  const [pendingOpen, setPendingOpen] = useState(false);
  const [localCountdown, setLocalCountdown] = useState(0);
  const [formResetKey, setFormResetKey] = useState(0);

  const { showForm: internalFormOpen, countdown: internalCountdown, openForm: handleOpenCommentForm, closeForm: handleCloseCommentForm } = useCountdownForm();

  const countdown = externalIsCommentFormOpen !== undefined ? localCountdown : internalCountdown;
  const isCommentFormOpen = (externalIsCommentFormOpen ?? internalFormOpen) || pendingOpen;

  const setCommentFormOpen = (value: boolean) => {
    onCommentFormOpenChange?.(value);
    if (value) {
      setPendingOpen(true);
    } else {
      setPendingOpen(false);
    }
  };

  const handleOpenForm = () => {
    if (externalIsCommentFormOpen !== undefined) {
      setLocalCountdown(3);
    } else {
      handleOpenCommentForm();
    }
  };

  useEffect(() => {
    if (externalIsCommentFormOpen === undefined) return;
    if (localCountdown === 0) return;

    const interval = setInterval(() => {
      setLocalCountdown((countdown) => {
        if (countdown <= 1) {
          setPendingOpen(true);
          queueMicrotask(() => onCommentFormOpenChange?.(true));
          return 0;
        }
        return countdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [localCountdown, externalIsCommentFormOpen, onCommentFormOpenChange]);

  const selectedQuote = externalSelectedQuote ?? internalSelectedQuote;
  const clearSelectedQuote = onClearSelectedQuote ?? (() => setInternalSelectedQuote(""));

  const onFormClose = () => {
    if (externalIsCommentFormOpen !== undefined) {
      setCommentFormOpen(false);
    } else {
      handleCloseCommentForm();
    }
    clearSelectedQuote();
    setFormResetKey((key) => key + 1);
  };

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
          {!isCommentFormOpen ? (
            <>
              <button
                onClick={handleOpenForm}
                disabled={countdown > 0}
                className="mt-3 text-xl font-medium text-blue-600 hover:underline disabled:cursor-wait disabled:no-underline dark:text-blue-400"
              >
                Odpowiedz
              </button>
              {countdown > 0 && <CountdownIndicator countdown={countdown} />}
            </>
          ) : (
            <>
              <button
                onClick={onFormClose}
                className="mt-3 text-xl font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Ukryj formularz
              </button>
              <CommentForm
                key={formResetKey}
                onSubmit={onAddComment}
                selectedQuote={selectedQuote}
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