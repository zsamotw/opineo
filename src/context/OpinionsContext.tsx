"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Opinion, Comment, CommentReply } from "../data/opinions";
import { ReactionType } from "../types/reaction";
import { 
  getOpinions, 
  updateOpinionComments, 
  updateOpinionReactions,
  hasStoredOpinions,
  initializeMockData
} from "../lib/db";
import { mockOpinions } from "../data/mockData";
import { useUserId } from "../lib/useUserId";

interface OpinionsContextType {
  opinions: Opinion[];
  loading: boolean;
  error: string | null;
  
  // Opinion actions
  getOpinionComments: (opinionId: string) => Comment[];
  addComment: (opinionId: string, comment: Omit<Comment, "replies" | "reactions">) => Promise<void>;
  addReply: (opinionId: string, commentId: string, reply: Omit<CommentReply, "reactions">) => Promise<void>;
  toggleCommentReaction: (opinionId: string, commentId: string, type: ReactionType) => Promise<void>;
  toggleReplyReaction: (opinionId: string, commentId: string, replyId: string, type: ReactionType) => Promise<void>;
  toggleOpinionReaction: (opinionId: string, reactions: ReactionType[], userId: string) => Promise<void>;
  refreshOpinions: () => Promise<void>;
}

const OpinionsContext = createContext<OpinionsContextType | undefined>(undefined);

interface OpinionsProviderProps {
  children: ReactNode;
}

function mergeCommentReaction(comments: Comment[], commentId: string, type: ReactionType, userId: string): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const existingReaction = comment.reactions.find(
        (reaction) => reaction.type === type && reaction.userId === userId
      );
      const newReactions = existingReaction
        ? comment.reactions.filter((reaction) => !(reaction.type === type && reaction.userId === userId))
        : [...comment.reactions, { type, userId }];
      return { ...comment, reactions: newReactions };
    }
    return comment;
  });
}

function mergeReplyReaction(comments: Comment[], commentId: string, replyId: string, type: ReactionType, userId: string): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const newReplies = comment.replies.map((reply) => {
        if (reply.id === replyId) {
          const existingReaction = reply.reactions.find(
            (reaction) => reaction.type === type && reaction.userId === userId
          );
          const newReactions = existingReaction
            ? reply.reactions.filter((reaction) => !(reaction.type === type && reaction.userId === userId))
            : [...reply.reactions, { type, userId }];
          return { ...reply, reactions: newReactions };
        }
        return reply;
      });
      return { ...comment, replies: newReplies };
    }
    return comment;
  });
}

export function OpinionsProvider({ children }: OpinionsProviderProps) {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserId();

  const loadOpinions = useCallback(async () => {
    try {
      const hasData = await hasStoredOpinions();
      if (!hasData) {
        await initializeMockData(mockOpinions);
      }
      const loadedOpinions = await getOpinions();
      const sorted = loadedOpinions.toSorted((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateB - dateA;
      });
      setOpinions(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load opinions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpinions();
  }, [loadOpinions]);

  const getOpinionComments = useCallback((opinionId: string): Comment[] => {
    const opinion = opinions.find((opinion) => opinion.id === opinionId);
    return opinion?.comments || [];
  }, [opinions]);

  const addComment = useCallback(async (opinionId: string, comment: Omit<Comment, "replies" | "reactions">) => {
    const newComment: Comment = { ...comment, replies: [], reactions: [] };
    
    setOpinions((prev) =>
      prev.map((opinion) => {
        if (opinion.id === opinionId) {
          return {
            ...opinion,
            comments: [...opinion.comments, newComment],
          };
        }
        return opinion;
      })
    );

    const opinion = opinions.find((opinion) => opinion.id === opinionId);
    if (opinion) {
      await updateOpinionComments(opinionId, [...opinion.comments, newComment]);
    }
  }, [opinions]);

  const addReply = useCallback(async (opinionId: string, commentId: string, reply: Omit<CommentReply, "reactions">) => {
    const newReply: CommentReply = { ...reply, reactions: [] };
    
    setOpinions((prev) =>
      prev.map((opinion) => {
        if (opinion.id === opinionId) {
          return {
            ...opinion,
            comments: opinion.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply],
                };
              }
              return comment;
            }),
          };
        }
        return opinion;
      })
    );

    const opinion = opinions.find((opinion) => opinion.id === opinionId);
    if (opinion) {
      const updatedComments = opinion.comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...(comment.replies || []), newReply] };
        }
        return comment;
      });
      await updateOpinionComments(opinionId, updatedComments);
    }
  }, [opinions]);

  const toggleCommentReaction = useCallback(async (opinionId: string, commentId: string, type: ReactionType) => {
    if (!userId) return;
    
    setOpinions((prev) =>
      prev.map((opinion) => {
        if (opinion.id === opinionId) {
          const updatedComments = mergeCommentReaction(opinion.comments, commentId, type, userId);
          return { ...opinion, comments: updatedComments };
        }
        return opinion;
      })
    );

    const opinion = opinions.find((opinion) => opinion.id === opinionId);
    if (opinion) {
      const updatedComments = mergeCommentReaction(opinion.comments, commentId, type, userId);
      await updateOpinionComments(opinionId, updatedComments);
    }
  }, [opinions, userId]);

  const toggleReplyReaction = useCallback(async (opinionId: string, commentId: string, replyId: string, type: ReactionType) => {
    if (!userId) return;
    
    setOpinions((prev) =>
      prev.map((opinion) => {
        if (opinion.id === opinionId) {
          const updatedComments = mergeReplyReaction(opinion.comments, commentId, replyId, type, userId);
          return { ...opinion, comments: updatedComments };
        }
        return opinion;
      })
    );

    const opinion = opinions.find((opinion) => opinion.id === opinionId);
    if (opinion) {
      const updatedComments = mergeReplyReaction(opinion.comments, commentId, replyId, type, userId);
      await updateOpinionComments(opinionId, updatedComments);
    }
  }, [opinions, userId]);

  const toggleOpinionReaction = useCallback(async (opinionId: string, types: ReactionType[], userId: string) => {
    setOpinions((prev) =>
      prev.map((opinion) => {
        if (opinion.id === opinionId) {
          const reactions = opinion.reactions || [];
          const newReactions = [...reactions];
          types.forEach((type) => {
            const existingIndex = newReactions.findIndex((reaction) => reaction.type === type && reaction.userId === userId);
            if (existingIndex >= 0) {
              newReactions.splice(existingIndex, 1);
            } else {
              newReactions.push({ type, userId });
            }
          });
          return { ...opinion, reactions: newReactions };
        }
        return opinion;
      })
    );

    const opinion = opinions.find((opinion) => opinion.id === opinionId);
    if (opinion) {
      const reactions = opinion.reactions || [];
      const newReactions = [...reactions];
      types.forEach((type) => {
        const existingIndex = newReactions.findIndex((reaction) => reaction.type === type && reaction.userId === userId);
        if (existingIndex >= 0) {
          newReactions.splice(existingIndex, 1);
        } else {
          newReactions.push({ type, userId });
        }
      });
      await updateOpinionReactions(opinionId, newReactions);
    }
  }, [opinions]);

  const refreshOpinions = useCallback(async () => {
    setLoading(true);
    await loadOpinions();
  }, [loadOpinions]);

  return (
    <OpinionsContext.Provider
      value={{
        opinions,
        loading,
        error,
        getOpinionComments,
        addComment,
        addReply,
        toggleCommentReaction,
        toggleReplyReaction,
        toggleOpinionReaction,
        refreshOpinions,
      }}
    >
      {children}
    </OpinionsContext.Provider>
  );
}

export function useOpinions() {
  const context = useContext(OpinionsContext);
  if (context === undefined) {
    throw new Error("useOpinions must be used within an OpinionsProvider");
  }
  return context;
}

export function useOpinion(opinionId: string) {
  const { opinions } = useOpinions();
  return opinions.find((opinion) => opinion.id === opinionId);
}

export function useOpinionComments(opinionId: string) {
  const { getOpinionComments } = useOpinions();
  return getOpinionComments(opinionId);
}