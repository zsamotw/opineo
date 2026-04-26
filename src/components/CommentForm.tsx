"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCommentForm } from "../lib/useCommentForm";

interface CommentFormProps {
  onSubmit: (comment: {
    id: string;
    user: { name: string; avatar: string | null };
    date: string;
    agree: string;
    disagree: string;
    selectedQuote?: string;
    replies?: {
      id: string;
      user: { name: string; avatar: string | null };
      date: string;
      agree: string;
      disagree: string;
      selectedQuote?: string;
    }[];
  }) => void;
  selectedQuote?: string;
  onClearSelectedQuote?: () => void;
  opinionContent?: string;
}

export function CommentForm({
  onSubmit,
  selectedQuote: externalSelectedQuote,
  onClearSelectedQuote,
  opinionContent,
}: CommentFormProps) {
  const [quoteFromCopy, setQuoteFromCopy] = useState("");
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { user, isLoaded } = useAuth();
  
  const initialQuote = externalSelectedQuote || quoteFromCopy;
  const { agree, disagree, error, hasAgree, setAgree, setDisagree, handleSubmit, setSelectedQuote } =
    useCommentForm({
      initialSelectedQuote: initialQuote,
      onSubmit,
    });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(user);
    onClearSelectedQuote?.();
    setQuoteFromCopy("");
    setIsQuoteOpen(false);
    window.getSelection()?.removeAllRanges();
  };

  const displayedQuote = initialQuote;

  const handleCopyClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      e.preventDefault();
      setQuoteFromCopy(text);
      setSelectedQuote(text);
    }
  };

  return (
    <div className="border-t border-gray-200 p-3 pt-3 dark:border-gray-700">
      {!isLoaded ? null : user ? (
        <form onSubmit={onFormSubmit} className="flex flex-col gap-3 p-3">
          <details open={isQuoteOpen} className="rounded-lg bg-white p-3 text-base dark:bg-gray-700">
            <summary 
              onClick={(e) => {
                e.preventDefault();
                setIsQuoteOpen(!isQuoteOpen);
              }}
              className="cursor-pointer list-none font-medium text-amber-600 dark:text-amber-400 flex items-center justify-between"
            >
              <span>
                {disagree.trim()
                  ? "Masz inne zdanie, super! Mimo to zaznacz fragment który warto rozważyć:"
                  : "Możesz zaznaczyć fragment, który warto rozważyć:"}
              </span>
              <span>{isQuoteOpen ? "▼" : "▶"}</span>
            </summary>
            {isQuoteOpen && opinionContent && (
              <div 
                onClick={handleCopyClick}
                className="mt-2 cursor-text rounded-lg border border-gray-200 bg-gray-50 p-3 text-base leading-normal text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 select-text selection:bg-yellow-200 selection:text-yellow-900"
              >
                {opinionContent}
              </div>
            )}
          </details>
          {displayedQuote && (
            <p className="mb-2 mt-2 text-base text-green-700 dark:text-green-300 whitespace-pre-wrap">
              &ldquo;{displayedQuote}&rdquo;
            </p>
          )}

          <div className="relative mt-4">
            <div className="absolute -left-3 top-2 h-3 w-1 rounded-full bg-green-500"></div>
            <textarea
              value={agree}
              onChange={(e) => setAgree(e.target.value)}
              placeholder={disagree.trim() ? "...lub podziel się tym, co cenisz w tej opinii" : "Zgadzam się — świetny punkt!"}
              rows={2}
              className="w-full rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-700 dark:bg-green-900/20 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -left-3 top-2 h-3 w-1 rounded-full bg-orange-500"></div>
            <textarea
              value={disagree}
              onChange={(e) => setDisagree(e.target.value)}
              placeholder="Cenę tę perspektywę; pozwól, że przedstawię odmienne spojrzenie."
              rows={2}
              className="w-full rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-base focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-orange-700 dark:bg-orange-900/20 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          {error && (
            <p className="text-base text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={!hasAgree}
            className="self-start rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Wyślij
          </button>
        </form>
      ) : (
        <p className="text-base text-gray-500 dark:text-gray-400">
          <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Zaloguj się
          </Link>{" "}
          aby dodać komentarz
        </p>
      )}
    </div>
  );
}
