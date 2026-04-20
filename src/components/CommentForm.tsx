"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface CommentFormProps {
  onSubmit: (comment: { id: string; user: { name: string; avatar: string | null }; date: string; agree: string; disagree: string; selectedQuote?: string; replies?: { id: string; user: { name: string; avatar: string | null }; date: string; agree: string; disagree: string; selectedQuote?: string }[] }) => void;
  commentCount: number;
  selectedQuote?: string;
  onDisagreeChange?: (hasDisagree: boolean) => void;
  onClearSelectedQuote?: () => void;
}

export function CommentForm({ onSubmit, commentCount, selectedQuote, onDisagreeChange, onClearSelectedQuote }: CommentFormProps) {
  const { user } = useAuth();
  const [agree, setAgree] = useState(selectedQuote || "");
  const [disagree, setDisagree] = useState("");
  const [error, setError] = useState("");

  const hasAgree = agree.trim() || selectedQuote;

  const handleDisagreeChange = (value: string) => {
    setDisagree(value);
    onDisagreeChange?.(value.trim().length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasAgree && !disagree.trim()) {
      setError("Musisz wpisać z czym się zgadzasz lub nie zgadzasz");
      return;
    }

    if (disagree.trim() && !hasAgree) {
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
      id: `c${Date.now()}`,
      user: { name: `${user.firstName} ${user.lastName}`, avatar: null },
      date: new Date().toISOString(),
      agree: agree.trim(),
      disagree: disagree.trim(),
      selectedQuote: selectedQuote || undefined,
    });

    setAgree("");
    setDisagree("");
    onDisagreeChange?.(false);
    onClearSelectedQuote?.();
  };

  return (
    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {disagree.trim() && (
            <div className="rounded-lg bg-yellow-50 p-3 text-lg dark:bg-yellow-900/20">
              <p className="mb-2 font-medium text-yellow-800 dark:text-yellow-200">
                Masz inne zdanie, ale mimo to zaznacz fragment który warto rozważyć:
              </p>
              {selectedQuote && (
                <p className="mb-2 text-lg text-green-700 dark:text-green-300 whitespace-pre-wrap">
                  "{selectedQuote}"
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <div className="absolute -left-3 top-2 h-4 w-1 rounded-full bg-green-500"></div>
            <textarea
              value={agree}
              onChange={(e) => setAgree(e.target.value)}
              placeholder={disagree.trim() ? "Napisz co cenisz w tej opini, mimo iż nie do końca się z nią zgadzasz" : "Zgadzam się — świetny punkt!"}
              rows={2}
              className="w-full rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-700 dark:bg-green-900/20 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -left-3 top-2 h-4 w-1 rounded-full bg-orange-500"></div>
            <textarea
              value={disagree}
              onChange={(e) => handleDisagreeChange(e.target.value)}
              placeholder="Cenę tę perspektywę; pozwól, że przedstawię odmienne spojrzenie."
              rows={2}
              className="w-full rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-orange-700 dark:bg-orange-900/20 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          {error && (
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={!hasAgree}
            className="self-start rounded-lg bg-blue-600 px-4 py-2 text-lg font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Wyślij
          </button>
        </form>
      ) : (
        <p className="text-lg text-gray-500 dark:text-gray-400">
          <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Zaloguj się
          </Link>{" "}
          aby dodać komentarz
        </p>
      )}
    </div>
  );
}