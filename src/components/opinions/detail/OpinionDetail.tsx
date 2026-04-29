"use client";

import Link from "next/link";
import { Opinion } from "@/src/data/opinions";
import { BackIcon } from "@/src/components/Icons";
import { ReactionsBar } from "@/src/components/ReactionsBar";
import { Resume } from "@/src/components/Resume";
import { CommentsAccordion } from "@/src/components/CommentsAccordion";
import { useOpinionCard } from "@/src/hooks/useOpinionCard";

interface OpinionDetailProps {
  opinion: Opinion;
}

export function OpinionDetail({ opinion }: OpinionDetailProps) {
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
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-4 mb-4 text-blue-600 hover:underline dark:text-blue-400"
      >
        <BackIcon size={18} />
        <span>Powrót do feedu</span>
      </Link>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 lg:p-8 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {opinion.user.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(opinion.date).toLocaleDateString("pl-PL")}
          </span>
        </div>
        <p 
          className={`mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200 select-text "cursor-text"}`}
        >
          {opinion.content}
        </p>
        <ReactionsBar
          reactions={opinion.reactions || []}
          onToggle={(type) => handleOpinionReaction(type)}
          userId={userId}
          size="lg"
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 lg:p-8 dark:border-gray-700 dark:bg-gray-900">
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