"use client";

import { Opinion } from "@/src/data/opinions";
import { OpinionCardHeader } from "@/src/components/OpinionCardHeader";
import { CommentsAccordion } from "@/src/components/CommentsAccordion";
import { Resume } from "@/src/components/Resume";
import { ReactionsBar } from "@/src/components/ReactionsBar";
import { useOpinionCard } from "@/src/hooks/useOpinionCard";

interface OpinionCardProps {
  opinion: Opinion;
}

export function OpinionCard({ opinion }: OpinionCardProps) {
  const {
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
    handleOpinionReaction,
  } = useOpinionCard({ opinion });

  return (
    <div className="rounded-lg border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 w-full">
      <OpinionCardHeader name={opinion.user.name} date={opinion.date} />
      <p 
        className={`mb-2 text-base leading-normal text-gray-800 dark:text-gray-200 select-text  "cursor-text"}`}
      >{opinion.content}</p>
      <ReactionsBar reactions={opinion.reactions || []} onToggle={(type) => handleOpinionReaction(type)} userId={userId} size="lg" />
      <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
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