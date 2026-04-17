"use client";

import { useState, useCallback } from "react";
import { Comment, CommentReply } from "../data/opinions";
import { updateOpinionComments } from "../lib/db";
import { useUserId } from "../lib/useUserId";
import { ReactionType } from "../lib/useReactionToggle";

interface UseCommentsOptions {
  initialComments: Comment[];
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

export function useComments({ initialComments, opinionId }: UseCommentsOptions): UseCommentsReturn {
  const [comments, setComments] = useState(initialComments);
  const userId = useUserId();

  const addComment = useCallback(async (comment: Omit<Comment, "replies" | "reactions">) => {
    const newComment = { ...comment, replies: [], reactions: [] };
    const newComments = [...comments, newComment];
    setComments(newComments);
    await updateOpinionComments(opinionId, newComments);
  }, [comments, opinionId]);

  const addReply = useCallback(async (commentId: string, reply: Omit<CommentReply, "reactions">) => {
    const newReply = { ...reply, reactions: [] };
    const newComments = comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });
    setComments(newComments);
    await updateOpinionComments(opinionId, newComments);
  }, [comments, opinionId]);

  const toggleReaction = useCallback(async (commentId: string, type: ReactionType) => {
    if (!userId) return;

    const newComments = comments.map((c) => {
      if (c.id === commentId) {
        const existingReaction = (c.reactions || []).find((r) => r.type === type && r.userId === userId);
        const newReactions = existingReaction
          ? (c.reactions || []).filter((r) => !(r.type === type && r.userId === userId))
          : [...(c.reactions || []), { type, userId }];
        return { ...c, reactions: newReactions };
      }
      return c;
    });
    setComments(newComments);
    await updateOpinionComments(opinionId, newComments);
  }, [comments, opinionId, userId]);

  const toggleReplyReaction = useCallback(async (commentId: string, replyId: string, type: ReactionType) => {
    if (!userId) return;

    const newComments = comments.map((c) => {
      if (c.id === commentId) {
        const newReplies = (c.replies || []).map((r) => {
          if (r.id === replyId) {
            const existingReaction = (r.reactions || []).find((r) => r.type === type && r.userId === userId);
            const newReactions = existingReaction
              ? (r.reactions || []).filter((r) => !(r.type === type && r.userId === userId))
              : [...(r.reactions || []), { type, userId }];
            return { ...r, reactions: newReactions };
          }
          return r;
        });
        return { ...c, replies: newReplies };
      }
      return c;
    });
    setComments(newComments);
    await updateOpinionComments(opinionId, newComments);
  }, [comments, opinionId, userId]);

  return {
    comments,
    addComment,
    addReply,
    toggleReaction,
    toggleReplyReaction,
    userId,
  };
}