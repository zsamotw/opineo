"use client";

import { useState } from "react";
import { Comment, CommentReply } from "../data/opinions";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { ReactionType } from "../lib/useReactionToggle";

interface CommentsAccordionProps {
  comments: Comment[];
  opinionId: string;
  selectedQuote: string;
  onDisagreeChange: (hasDisagree: boolean) => void;
  onClearSelectedQuote: () => void;
  onAddComment: (comment: Omit<Comment, "replies" | "reactions">) => void;
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => void;
  onToggleCommentReaction: (commentId: string, type: ReactionType) => void;
  onToggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => void;
  userId?: string;
}

export function CommentsAccordion({
  comments,
  selectedQuote,
  onDisagreeChange,
  onClearSelectedQuote,
  onAddComment,
  onAddReply,
  onToggleCommentReaction,
  onToggleReplyReaction,
  userId,
}: CommentsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        <span>Komentarze ({comments.length})</span>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 px-3 pb-3 dark:border-gray-700">
          <CommentForm
            onSubmit={onAddComment}
            commentCount={comments.length}
            selectedQuote={selectedQuote}
            onDisagreeChange={onDisagreeChange}
            onClearSelectedQuote={onClearSelectedQuote}
          />
          {comments.length > 0 && (
            <div className="mt-4">
              <CommentList
                comments={comments}
                onAddReply={onAddReply}
                onToggleReaction={onToggleCommentReaction}
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