"use client";

import { useState, useCallback } from "react";
import { Opinion, Comment, CommentReply, Reaction } from "../data/opinions";
import { OpinionCardHeader } from "./OpinionCardHeader";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { ReactionBar } from "./ReactionBar";
import { updateOpinionComments, updateOpinionReactions } from "../lib/db";
import { useUserId } from "../lib/useUserId";
import { useReactionToggle, ReactionType } from "../lib/useReactionToggle";

interface OpinionCardProps {
  opinion: Opinion;
}

export function OpinionCard({ opinion }: OpinionCardProps) {
  const [comments, setComments] = useState(opinion.comments);
  const [selectedQuote, setSelectedQuote] = useState("");
  const [hasDisagree, setHasDisagree] = useState(false);
  const userId = useUserId();

  const handleSaveReactions = useCallback(async (reactions: Reaction[]) => {
    await updateOpinionReactions(opinion.id, reactions);
  }, [opinion.id]);

  const handleContentClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    if (!hasDisagree) return null;

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

  const handleAddComment = useCallback(async (comment: Omit<Comment, "replies" | "reactions">) => {
    const newComment = { ...comment, replies: [], reactions: [] };
    const newComments = [...comments, newComment];
    setComments(newComments);
    await updateOpinionComments(opinion.id, newComments);
  }, [comments, opinion.id]);

  const handleAddReply = useCallback(async (commentId: string, reply: Omit<CommentReply, "reactions">) => {
    const newReply = { ...reply, reactions: [] };
    const newComments = comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });
    setComments(newComments);
    await updateOpinionComments(opinion.id, newComments);
  }, [comments, opinion.id]);

  const handleToggleCommentReaction = useCallback(async (commentId: string, type: ReactionType) => {
    if (!userId) return;

    const newComments = comments.map((c) => {
      if (c.id === commentId) {
        const existingReaction = (c.reactions || []).find((r) => r.type === type && r.userId === userId);
        let newReactions: Reaction[];
        if (existingReaction) {
          newReactions = (c.reactions || []).filter((r) => !(r.type === type && r.userId === userId));
        } else {
          newReactions = [...(c.reactions || []), { type, userId }];
        }
        return { ...c, reactions: newReactions };
      }
      return c;
    });
    setComments(newComments);
    await updateOpinionComments(opinion.id, newComments);
  }, [comments, opinion.id, userId]);

  const handleToggleReplyReaction = useCallback(async (commentId: string, replyId: string, type: ReactionType) => {
    if (!userId) return;

    const newComments = comments.map((c) => {
      if (c.id === commentId) {
        const newReplies = (c.replies || []).map((r) => {
          if (r.id === replyId) {
            const existingReaction = (r.reactions || []).find((r) => r.type === type && r.userId === userId);
            let newReactions: Reaction[];
            if (existingReaction) {
              newReactions = (r.reactions || []).filter((r) => !(r.type === type && r.userId === userId));
            } else {
              newReactions = [...(r.reactions || []), { type, userId }];
            }
            return { ...r, reactions: newReactions };
          }
          return r;
        });
        return { ...c, replies: newReplies };
      }
      return c;
    });
    setComments(newComments);
    await updateOpinionComments(opinion.id, newComments);
  }, [comments, opinion.id, userId]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <OpinionCardHeader name={opinion.user.name} date={opinion.date} />
      <p 
        className={`mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200 select-text ${hasDisagree ? "cursor-text rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 selection:bg-yellow-200 selection:text-gray-900" : "cursor-text"}`}
        onClick={handleContentClick}
      >{opinion.content}</p>
      <ReactionBar reactions={localReactions} onToggle={(type) => toggleOpinionReaction(type, userId || "")} userId={userId} />
      <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
        <CommentForm 
          onSubmit={handleAddComment} 
          commentCount={comments.length} 
          selectedQuote={selectedQuote}
          onDisagreeChange={setHasDisagree}
          onClearSelectedQuote={() => setSelectedQuote("")}
        />
        {comments.length > 0 && (
          <div className="mt-4">
            <CommentList
              comments={comments}
              onAddReply={handleAddReply}
              onToggleReaction={handleToggleCommentReaction}
              onToggleReplyReaction={handleToggleReplyReaction}
              userId={userId}
            />
          </div>
        )}
      </div>
    </div>
  );
}