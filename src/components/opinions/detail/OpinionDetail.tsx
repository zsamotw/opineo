"use client";

import { useState } from "react";
import Link from "next/link";
import { Opinion } from "@/src/data/opinions";
import { ReactionType } from "@/src/types/reaction";
import { BackIcon } from "@/src/components/Icons";
import { ReactionsBar } from "@/src/components/ReactionsBar";
import { useOpinions } from "@/src/context/OpinionsContext";
import { useUserId } from "@/src/lib/useUserId";
import { useComments } from "@/src/lib/useComments";
import { Resume } from "@/src/components/Resume";
import { CommentsAccordion } from "./CommentsAccordion";

interface OpinionDetailProps {
  opinion: Opinion;
}

export function OpinionDetail({ opinion }: OpinionDetailProps) {
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

  const handleReaction = async (type: ReactionType) => {
    if (!userId) return;
    await toggleOpinionReaction(opinion.id, [type], userId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-4 text-blue-600 hover:underline dark:text-blue-400"
      >
        <BackIcon size={18} />
        <span>Powrót do feedu</span>
      </Link>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 lg:p-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {opinion.user.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(opinion.date).toLocaleDateString("pl-PL")}
          </span>
        </div>
        <p 
          className={`mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200 select-text ${isCommentFormOpen ? "cursor-text rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 selection:bg-yellow-200 selection:text-yellow-900" : "cursor-text"}`}
          onClick={handleContentClick}
        >
          {opinion.content}
        </p>
        <ReactionsBar
          reactions={opinion.reactions || []}
          onToggle={handleReaction}
          userId={userId}
          size="lg"
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 lg:p-8 dark:border-gray-700 dark:bg-gray-800">
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