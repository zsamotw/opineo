"use client";

import { useState } from "react";
import { Opinion } from "../data/opinions";
import { ReactionType } from "../types/reaction";
import { OpinionCardHeader } from "./OpinionCardHeader";
import { CommentsAccordion } from "./CommentsAccordion";
import { Resume } from "./Resume";
import { ReactionsBar } from "./ReactionsBar";
import { useUserId } from "../lib/useUserId";
import { useComments } from "../lib/useComments";
import { useOpinions } from "../context/OpinionsContext";

interface OpinionCardProps {
  opinion: Opinion;
}

export function OpinionCard({ opinion }: OpinionCardProps) {
  const [selectedQuote, setSelectedQuote] = useState("");
  const userId = useUserId();
  const { toggleOpinionReaction } = useOpinions();

  const { comments, addComment, addReply, toggleReaction, toggleReplyReaction } = useComments({
    opinionId: opinion.id,
  });

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

  const handleOpinionReaction = async (type: ReactionType, userId: string) => {
    await toggleOpinionReaction(opinion.id, [type], userId);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 w-full">
      <OpinionCardHeader name={opinion.user.name} date={opinion.date} />
      <p 
        className={`mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200 select-text ${isCommentFormOpen ? "cursor-text rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 selection:bg-yellow-200 selection:text-yellow-900" : "cursor-text"}`}
        onClick={handleContentClick}
      >{opinion.content}</p>
      <ReactionsBar reactions={opinion.reactions || []} onToggle={(type) => handleOpinionReaction(type, userId || "")} userId={userId} size="lg" />
      <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
        <Resume comments={comments} opinionContent={opinion.content} />
        <CommentsAccordion
          comments={comments}
          selectedQuote={selectedQuote}
          onClearSelectedQuote={() => setSelectedQuote("")}
          opinionContent={opinion.content}
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