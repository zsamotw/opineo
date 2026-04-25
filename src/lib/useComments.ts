"use client";

import { useCallback } from "react";
import { Comment, CommentReply } from "../data/opinions";
import { ReactionType } from "../types/reaction";
import { useOpinions } from "../context/OpinionsContext";
import { useUserId } from "../lib/useUserId";

interface UseCommentsOptions {
  opinionId: string;
}

interface UseCommentsReturn {
  comments: Comment[];
  addComment: (comment: Omit<Comment, "replies" | "reactions">) => Promise<void>;
  addReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => Promise<void>;
  toggleReaction: (commentId: string, type: ReactionType) => Promise<void>;
  toggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => Promise<void>;
  userId?: string;
}

export function useComments({ opinionId }: UseCommentsOptions): UseCommentsReturn {
  const { getOpinionComments, addComment, addReply, toggleCommentReaction, toggleReplyReaction } = useOpinions();
  const userId = useUserId();

  const comments = getOpinionComments(opinionId);

  const handleAddComment = useCallback(
    async (comment: Omit<Comment, "replies" | "reactions">) => {
      await addComment(opinionId, comment);
    },
    [opinionId, addComment]
  );

  const handleAddReply = useCallback(
    async (commentId: string, reply: Omit<CommentReply, "reactions">) => {
      await addReply(opinionId, commentId, reply);
    },
    [opinionId, addReply]
  );

  const handleToggleReaction = useCallback(
    async (commentId: string, type: ReactionType) => {
      await toggleCommentReaction(opinionId, commentId, type);
    },
    [opinionId, toggleCommentReaction]
  );

  const handleToggleReplyReaction = useCallback(
    async (commentId: string, replyId: string, type: ReactionType) => {
      await toggleReplyReaction(opinionId, commentId, replyId, type);
    },
    [opinionId, toggleReplyReaction]
  );

  return {
    comments,
    addComment: handleAddComment,
    addReply: handleAddReply,
    toggleReaction: handleToggleReaction,
    toggleReplyReaction: handleToggleReplyReaction,
    userId,
  };
}