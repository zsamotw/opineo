"use client";

import { useState, useCallback } from "react";
import { Comment, CommentReply } from "../data/opinions";
import { updateOpinionComments } from "../lib/db";
import { useUserId } from "../lib/useUserId";
import { ReactionType } from "../types/reaction";

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
    const newComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...(comment.replies || []), newReply] };
      }
      return comment;
    });
    setComments(newComments);
    await updateOpinionComments(opinionId, newComments);
  }, [comments, opinionId]);

  const toggleReaction = useCallback(async (commentId: string, type: ReactionType) => {
    if (!userId) return;

    const newComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const existingReaction = (comment.reactions || []).find((reaction) => reaction.type === type && reaction.userId === userId);
        const newReactions = existingReaction
          ? (comment.reactions || []).filter((reaction) => !(reaction.type === type && reaction.userId === userId))
          : [...(comment.reactions || []), { type, userId }];
        return { ...comment, reactions: newReactions };
      }
      return comment;
    });
    setComments(newComments);
    await updateOpinionComments(opinionId, newComments);
  }, [comments, opinionId, userId]);

  const toggleReplyReaction = useCallback(async (commentId: string, replyId: string, type: ReactionType) => {
    if (!userId) return;

    const newComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const newReplies = (comment.replies || []).map((reply) => {
          if (reply.id === replyId) {
            const existingReaction = (reply.reactions || []).find((reaction) => reaction.type === type && reaction.userId === userId);
            const newReactions = existingReaction
              ? (reply.reactions || []).filter((reaction) => !(reaction.type === type && reaction.userId === userId))
              : [...(reply.reactions || []), { type, userId }];
            return { ...reply, reactions: newReactions };
          }
          return reply;
        });
        return { ...comment, replies: newReplies };
      }
      return comment;
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