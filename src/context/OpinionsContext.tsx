"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Opinion, Comment, CommentReply, Reaction } from "@/src/data/opinions";
import { ReactionType } from "@/src/types/reaction";
import { 
  getOpinions, 
  updateOpinionComments, 
  updateOpinionReactions,
  hasStoredOpinions,
  initializeMockData
} from "@/src/lib/db";
import { mockOpinions } from "@/src/data/mockData";
import { useUserId } from "@/src/lib/useUserId";

interface OpinionsContextType {
  opinions: Opinion[];
  isLoaded: boolean;
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
  const [isLoaded, setIsLoaded] = useState(false);
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
      setIsLoaded(true);
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
    let updatedComments: Comment[] = [];
    
    setOpinions((prev) => {
      const opinion = prev.find((op) => op.id === opinionId);
      if (!opinion) return prev;
      
      updatedComments = [...opinion.comments, newComment];
      return prev.map((op) => {
        if (op.id === opinionId) {
          return { ...op, comments: updatedComments };
        }
        return op;
      });
    });

    if (updatedComments.length > 0) {
      try {
        await updateOpinionComments(opinionId, updatedComments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add comment");
      }
    }
  }, []);

  const addReply = useCallback(async (opinionId: string, commentId: string, reply: Omit<CommentReply, "reactions">) => {
    const newReply: CommentReply = { ...reply, reactions: [] };
    let updatedComments: Comment[] = [];
    
    setOpinions((prev) => {
      const opinion = prev.find((op) => op.id === opinionId);
      if (!opinion) return prev;
      
      updatedComments = opinion.comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...(comment.replies || []), newReply] };
        }
        return comment;
      });
      
      return prev.map((op) => {
        if (op.id === opinionId) {
          return { ...op, comments: updatedComments };
        }
        return op;
      });
    });

    if (updatedComments.length > 0) {
      try {
        await updateOpinionComments(opinionId, updatedComments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add reply");
      }
    }
  }, []);

  const toggleCommentReaction = useCallback(async (opinionId: string, commentId: string, type: ReactionType) => {
    if (!userId) return;
    
    let updatedComments: Comment[] = [];
    
    setOpinions((prev) => {
      const opinion = prev.find((op) => op.id === opinionId);
      if (!opinion) return prev;
      
      updatedComments = mergeCommentReaction(opinion.comments, commentId, type, userId);
      return prev.map((op) => {
        if (op.id === opinionId) {
          return { ...op, comments: updatedComments };
        }
        return op;
      });
    });

    if (updatedComments.length > 0) {
      try {
        await updateOpinionComments(opinionId, updatedComments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle comment reaction");
      }
    }
  }, [userId]);

  const toggleReplyReaction = useCallback(async (opinionId: string, commentId: string, replyId: string, type: ReactionType) => {
    if (!userId) return;
    
    let updatedComments: Comment[] = [];
    
    setOpinions((prev) => {
      const opinion = prev.find((op) => op.id === opinionId);
      if (!opinion) return prev;
      
      updatedComments = mergeReplyReaction(opinion.comments, commentId, replyId, type, userId);
      return prev.map((op) => {
        if (op.id === opinionId) {
          return { ...op, comments: updatedComments };
        }
        return op;
      });
    });

    if (updatedComments.length > 0) {
      try {
        await updateOpinionComments(opinionId, updatedComments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle reply reaction");
      }
    }
  }, [userId]);

  const toggleOpinionReaction = useCallback(async (opinionId: string, types: ReactionType[], userId: string) => {
    let newReactions: Reaction[] = [];
    
    setOpinions((prev) => {
      return prev.map((opinion) => {
        if (opinion.id === opinionId) {
          const reactions = opinion.reactions || [];
          newReactions = [...reactions];
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
      });
    });

    if (newReactions.length > 0 || newReactions.length === 0) {
      try {
        await updateOpinionReactions(opinionId, newReactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle opinion reaction");
      }
    }
  }, []);

  const refreshOpinions = useCallback(async () => {
    setIsLoaded(false);
    await loadOpinions();
  }, [loadOpinions]);

  return (
    <OpinionsContext.Provider
      value={{
        opinions,
        isLoaded,
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