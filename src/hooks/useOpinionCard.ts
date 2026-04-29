import { useState, useCallback } from "react";
import { Opinion } from "@/src/data/opinions";
import { ReactionType } from "@/src/types/reaction";
import { useUserId } from "@/src/lib/useUserId";
import { useComments } from "@/src/lib/useComments";
import { useOpinions } from "@/src/context/OpinionsContext";

interface UseOpinionCardOptions {
  opinion: Opinion;
}

interface UseOpinionCardReturn {
  opinion: Opinion;
  userId: string;
  selectedQuote: string;
  setSelectedQuote: (quote: string) => void;
  isCommentFormOpen: boolean;
  setIsCommentFormOpen: (value: boolean) => void;
  comments: ReturnType<typeof useComments>["comments"];
  addComment: ReturnType<typeof useComments>["addComment"];
  addReply: ReturnType<typeof useComments>["addReply"];
  toggleReaction: ReturnType<typeof useComments>["toggleReaction"];
  toggleReplyReaction: ReturnType<typeof useComments>["toggleReplyReaction"];
  handleContentClick: (e: React.MouseEvent<HTMLParagraphElement>) => void;
  handleOpinionReaction: (type: ReactionType) => Promise<void>;
}

export function useOpinionCard({ opinion }: UseOpinionCardOptions): UseOpinionCardReturn {
  const [selectedQuote, setSelectedQuote] = useState("");
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const userId = useUserId();
  const { toggleOpinionReaction } = useOpinions();
  
  const { comments, addComment, addReply, toggleReaction, toggleReplyReaction } = useComments({
    opinionId: opinion.id,
  });

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLParagraphElement>) => {
    if (!isCommentFormOpen) return;
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 0) {
      e.preventDefault();
      setSelectedQuote(text);
    }
  }, [isCommentFormOpen]);

  const handleOpinionReaction = useCallback(async (type: ReactionType) => {
    if (!userId) return;
    await toggleOpinionReaction(opinion.id, [type], userId);
  }, [userId, opinion.id, toggleOpinionReaction]);

  return {
    opinion,
    userId,
    selectedQuote,
    setSelectedQuote,
    isCommentFormOpen,
    setIsCommentFormOpen,
    comments,
    addComment,
    addReply,
    toggleReaction,
    toggleReplyReaction,
    handleContentClick,
    handleOpinionReaction,
  };
}
