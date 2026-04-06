"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Comment, CommentReply } from "../data/opinions";
import { ReactionBar } from "./ReactionBar";
import { FormattedDate } from "./FormattedDate";

interface CommentListProps {
  comments: Comment[];
  onAddReply: (commentId: string, reply: Omit<CommentReply, "reactions">) => void;
  onToggleReaction: (commentId: string, type: "appreciate" | "changed" | "connect") => void;
  onToggleReplyReaction: (commentId: string, replyId: string, type: "appreciate" | "changed" | "connect") => void;
  userId?: string;
}

interface ReplyFormProps {
  onSubmit: (reply: { id: string; user: { name: string; avatar: string | null }; date: string; agree: string; disagree: string; selectedQuote?: string }) => void;
}

function ReplyForm({ onSubmit }: ReplyFormProps) {
  const { user } = useAuth();
  const [agree, setAgree] = useState("");
  const [disagree, setDisagree] = useState("");
  const [error, setError] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agree.trim() && !disagree.trim()) {
      setError("Musisz wpisać z czym się zgadzasz lub nie zgadzasz");
      return;
    }

    if (disagree.trim() && !agree.trim()) {
      setError("Jeśli wyrażasz niezgodę, musisz najpierw wskazać z czym się zgadzasz");
      return;
    }

    if (agree.trim().length > 500) {
      setError("Tekst zgody nie może przekraczać 500 znaków");
      return;
    }

    if (disagree.trim().length > 500) {
      setError("Tekst niezgody nie może przekraczać 500 znaków");
      return;
    }

    if (!user) return;

    onSubmit({
      id: `r${Date.now()}`,
      user: { name: `${user.firstName} ${user.lastName}`, avatar: null },
      date: new Date().toISOString(),
      agree: agree.trim(),
      disagree: disagree.trim(),
      selectedQuote: selectedQuote || undefined,
    });

    setAgree("");
    setDisagree("");
    setSelectedQuote("");
  };

  const hasAgree = agree.trim() || selectedQuote;

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-600 dark:bg-gray-800">
      <div className="relative">
        <div className="absolute -left-2 top-2 h-3 w-1 rounded-full bg-green-500"></div>
        <textarea
          value={agree}
          onChange={(e) => setAgree(e.target.value)}
          placeholder={disagree.trim() ? "Wyjaśnij jak rozumiesz tą opinie" : "Zgadzam się — świetny punkt!"}
          rows={1}
          className="w-full rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-700 dark:bg-green-900/20 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      <div className="relative">
        <div className="absolute -left-2 top-2 h-3 w-1 rounded-full bg-red-500"></div>
        <textarea
          value={disagree}
          onChange={(e) => setDisagree(e.target.value)}
          placeholder="Cenę tę perspektywę; pozwól, że przedstawię odmienne spojrzenie."
          rows={1}
          className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-red-700 dark:bg-red-900/20 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={!hasAgree}
          className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Odpowiedz
        </button>
      </div>
    </form>
  );
}

export function CommentList({ comments, onAddReply, onToggleReaction, onToggleReplyReaction, userId }: CommentListProps) {
  if (comments.length === 0) return null;

  return (
    <div className="mb-4 space-y-3">
      {comments.map((comment) => (
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
  onToggleReaction: (commentId: string, type: "appreciate" | "changed" | "connect") => void;
  onToggleReplyReaction: (commentId: string, replyId: string, type: "appreciate" | "changed" | "connect") => void;
  userId?: string;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (reply: Omit<CommentReply, "reactions">) => {
    onAddReply(comment.id, reply);
    setShowReplyForm(false);
  };

  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-200">
          {comment.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {comment.user.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <FormattedDate date={comment.date} />
              </span>
            </div>
            <ReactionBar
              reactions={comment.reactions || []}
              onToggle={(type) => onToggleReaction(comment.id, type)}
              userId={userId}
              size="sm"
            />
          </div>
          <div className="mt-2 space-y-2">
            {comment.selectedQuote && (
              <div className="flex gap-2">
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">❝ Ciekawe:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic whitespace-pre-wrap">"{comment.selectedQuote}"</p>
              </div>
            )}
            {comment.agree && (
              <div className="flex gap-2">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ {comment.disagree ? "Co cenię:" : "Zgadzam się:"}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.agree}</p>
              </div>
            )}
            {comment.disagree && (
              <div className="flex gap-2">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">✕ Nie zgadzam się:</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.disagree}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Odpowiedz
          </button>
          {showReplyForm && <ReplyForm onSubmit={handleReplySubmit} />}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-2 border-l-2 border-gray-300 pl-3 dark:border-gray-600">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="rounded bg-gray-100 p-2 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {reply.user.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        <FormattedDate date={reply.date} />
                      </span>
                    </div>
                    <ReactionBar
                      reactions={reply.reactions || []}
                      onToggle={(type) => onToggleReplyReaction(comment.id, reply.id, type)}
                      userId={userId}
                      size="sm"
                    />
                  </div>
                  <div className="mt-1 space-y-1">
                    {reply.selectedQuote && (
                      <div className="flex gap-1">
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">❝:</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic whitespace-pre-wrap">"{reply.selectedQuote}"</p>
                      </div>
                    )}
                    {reply.agree && (
                      <div className="flex gap-1">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          ✓ {reply.disagree ? "Co cenię:" : ""}
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{reply.agree}</p>
                      </div>
                    )}
                    {reply.disagree && (
                      <div className="flex gap-1">
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">✕ Nie zgadzam się:</span>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{reply.disagree}</p>
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