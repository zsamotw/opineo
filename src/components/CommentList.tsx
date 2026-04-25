"use client";

import { useAuth } from "../context/AuthContext";
import { Comment, CommentReply } from "../data/opinions";
import { ReactionType } from "../types/reaction";
import { ReactionsBar } from "./ReactionsBar";
import { FormattedDate } from "./FormattedDate";
import { useCountdownForm } from "../lib/useCountdownForm";
import { CountdownIndicator } from "./CountdownIndicator";
import { useCommentForm } from "../lib/useCommentForm";

interface CommentListProps {
  comments: Comment[];
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => void;
  onToggleReaction: (commentId: string, type: ReactionType) => void;
  onToggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => void;
  userId?: string;
}

interface ReplyFormProps {
  onSubmit: (reply: {
    id: string;
    user: { name: string; avatar: string | null };
    date: string;
    agree: string;
    disagree: string;
    selectedQuote?: string;
  }) => void;
}

function ReplyForm({ onSubmit }: ReplyFormProps) {
  const { user, isLoaded } = useAuth();
  const { agree, disagree, error, hasAgree, setAgree, setDisagree, handleReplySubmit, reset } = useCommentForm({
    onSubmit: (comment) => {
      onSubmit({
        id: comment.id,
        user: comment.user,
        date: comment.date,
        agree: comment.agree,
        disagree: comment.disagree,
        selectedQuote: comment.selectedQuote,
      });
      reset();
    },
  });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleReplySubmit(user);
  };

  if (!isLoaded || !user) return null;

  return (
    <form onSubmit={onFormSubmit} className="mt-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-gray-600 dark:bg-gray-800">
      <div className="relative">
        <div className="absolute -left-3 top-2 h-3 w-1 rounded-full bg-green-500"></div>
        <textarea
          value={agree}
          onChange={(e) => setAgree(e.target.value)}
          placeholder={disagree.trim() ? "Napisz co cenisz w tej opinii" : "Zgadzam się — świetny punkt!"}
          rows={2}
          className="w-full rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-700 dark:bg-green-900/20 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      <div className="relative">
        <div className="absolute -left-3 top-2 h-3 w-1 rounded-full bg-orange-500"></div>
        <textarea
          value={disagree}
          onChange={(e) => setDisagree(e.target.value)}
          placeholder="Cenę tę perspektywę; pozwól, że przedstawię odmienne spojrzenie."
          rows={2}
          className="w-full rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-orange-700 dark:bg-orange-900/20 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>
      {error && (
        <p className="text-base text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={!hasAgree}
          className="rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Odpowiedz
        </button>
      </div>
    </form>
  );
}

interface CommentListProps {
  comments: Comment[];
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => void;
  onToggleReaction: (commentId: string, type: ReactionType) => void;
  onToggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => void;
  userId?: string;
}

export function CommentList({ comments, onAddReply, onToggleReaction, onToggleReplyReaction, userId }: CommentListProps) {
  if (comments.length === 0) return null;

  const sortedComments = [...comments].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mb-4 space-y-3">
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onAddReply={onAddReply}
          onToggleReaction={onToggleReaction}
          onToggleReplyReaction={onToggleReplyReaction}
          userId={userId}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  onAddReply,
  onToggleReaction,
  onToggleReplyReaction,
  userId,
}: {
  comment: Comment;
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => void;
  onToggleReaction: (commentId: string, type: ReactionType) => void;
  onToggleReplyReaction: (commentId: string, replyId: string, type: ReactionType) => void;
  userId?: string;
}) {
  const { showForm: showReplyForm, countdown, openForm: handleReplyClick, closeForm: closeReplyForm } = useCountdownForm();

  const handleReplySubmit = (reply: Omit<CommentReply, "reactions">) => {
    onAddReply(comment.id, reply);
    closeReplyForm();
  };

  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700 sm:p-4">
      <div className="flex gap-2 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-base font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-200 sm:h-10 sm:w-10 sm:text-lg">
          {comment.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-base font-medium text-gray-900 dark:text-gray-100 sm:text-lg">
                {comment.user.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                <FormattedDate date={comment.date} />
              </span>
            </div>
            <ReactionsBar
              reactions={comment.reactions || []}
              onToggle={(type) => onToggleReaction(comment.id, type)}
              userId={userId}
              size="md"
            />
          </div>
          <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
            {comment.selectedQuote && (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:gap-x-3 sm:gap-y-1">
                <span className="text-base font-medium text-yellow-600 dark:text-yellow-400 whitespace-nowrap sm:text-lg">❝ Warte uwagi:</span>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 italic whitespace-pre-wrap sm:text-lg">&ldquo;{comment.selectedQuote}&rdquo;</p>
              </div>
            )}
            {comment.agree && (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:gap-x-3 sm:gap-y-1">
                <span className="text-base font-medium text-green-600 dark:text-green-400 whitespace-nowrap sm:text-lg">
                  ✓ {comment.disagree ? "Co cenię:" : "Zgadzam się:"}
                </span>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">{comment.agree}</p>
              </div>
            )}
            {comment.disagree && (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:gap-x-3 sm:gap-y-1">
                <span className="text-base font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap sm:text-lg">✕ Mam wątpliwości:</span>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">{comment.disagree}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleReplyClick}
            disabled={countdown > 0}
            className="mt-3 text-xl font-medium text-blue-600 hover:underline disabled:cursor-wait disabled:no-underline dark:text-blue-400"
          >
            {showReplyForm ? "Ukryj formularz" : "Odpowiedz"}
          </button>
          <CountdownIndicator countdown={countdown} />
          {showReplyForm && <ReplyForm onSubmit={handleReplySubmit} />}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2 border-l-2 border-gray-300 pl-2 sm:mt-4 sm:space-y-3 sm:pl-4 dark:border-gray-600">
              {comment.replies.map((reply) => (
<div key={reply.id} className="rounded bg-gray-100 p-2 dark:bg-gray-800 sm:p-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 sm:text-base">
                        {reply.user.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        <FormattedDate date={reply.date} />
                      </span>
                    </div>
                    <ReactionsBar
                      reactions={reply.reactions || []}
                      onToggle={(type) => onToggleReplyReaction(comment.id, reply.id, type)}
                      userId={userId}
                      size="sm"
                    />
                  </div>
                  <div className="mt-1 space-y-1 sm:mt-2 sm:space-y-2">
                    {reply.agree && (
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap sm:text-base">
                          ✓ {reply.disagree ? "Co cenię:" : "Zgadzam się:"}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">{reply.agree}</p>
                      </div>
                    )}
                    {reply.disagree && (
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-2">
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap sm:text-base">✕ Mam wątpliwości:</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">{reply.disagree}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}