"use client";

import { useState, useCallback } from "react";
import { Opinion, Reaction } from "../data/opinions";
import { OpinionCardHeader } from "./OpinionCardHeader";
import { CommentsAccordion } from "./CommentsAccordion";
import { Resume } from "./Resume";
import { ReactionsBar } from "./ReactionsBar";
import { updateOpinionReactions } from "../lib/db";
import { useUserId } from "../lib/useUserId";
import { useReactionToggle } from "../lib/useReactionToggle";
import { useComments } from "../lib/useComments";

interface OpinionCardProps {
  opinion: Opinion;
}

export function OpinionCard({ opinion }: OpinionCardProps) {
  const [selectedQuote, setSelectedQuote] = useState("");
  const userId = useUserId();

const { comments, addComment, addReply, toggleReaction, toggleReplyReaction } = useComments({
    initialComments: opinion.comments,
    opinionId: opinion.id,
  });

  const handleSaveReactions = useCallback(async (reactions: Reaction[]) => {
    await updateOpinionReactions(opinion.id, reactions);
  }, [opinion.id]);

  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

  const handleContentClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    if (!isCommentFormOpen) return null;

    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      e.preventDefault();
      setSelectedQuote(text);
    }
  };

  const { reactions: localReactions, toggle: toggleOpinionReaction } = useReactionToggle({
    reactions: opinion.reactions || [],
    onSave: handleSaveReactions,
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 w-full">
      <OpinionCardHeader name={opinion.user.name} date={opinion.date} />
      <p 
        className={`mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200 select-text ${isCommentFormOpen ? "cursor-text rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 selection:bg-yellow-200 selection:text-gray-900" : "cursor-text"}`}
        onClick={handleContentClick}
      >{opinion.content}</p>
      <ReactionsBar reactions={localReactions} onToggle={(type) => toggleOpinionReaction(type, userId || "")} userId={userId} size="lg" />
      <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
        <Resume comments={comments} opinionContent={opinion.content} />
        <CommentsAccordion
          comments={comments}
          selectedQuote={selectedQuote}
          onClearSelectedQuote={() => setSelectedQuote("")}
          onAddComment={addComment}
          onAddReply={addReply}
          onToggleReaction={toggleReaction}
          onToggleReplyReaction={toggleReplyReaction}
          userId={userId}
          isCommentFormOpen={isCommentFormOpen}
          onCommentFormOpenChange={setIsCommentFormOpen}
        />
      </div>
    </div>
  );
}