"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOpinions } from "../context/OpinionsContext";
import { addOpinion as saveOpinion } from "../lib/db";

export function OpinionForm() {
  const { user, isLoaded } = useAuth();
  const { refreshOpinions } = useOpinions();
  const [content, setContent] = useState("");

  if (!isLoaded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const opinion = {
      id: `o${Date.now()}`,
      user: { name: `${user.firstName} ${user.lastName}`, avatar: null },
      date: new Date().toISOString(),
      content: content.trim(),
      comments: [],
      reactions: [],
    };

    await saveOpinion(opinion);
    await refreshOpinions();

    setContent("");
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="To miejsce na Twoją opinię..."
        rows={3}
        className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Dodaj
      </button>
    </form>
  );
}