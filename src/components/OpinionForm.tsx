"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface OpinionFormProps {
  onAddOpinion: (opinion: { id: string; user: { name: string; avatar: string | null }; date: string; content: string; comments: []; reactions: [] }) => void;
}

export function OpinionForm({ onAddOpinion }: OpinionFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    onAddOpinion({
      id: `o${Date.now()}`,
      user: { name: `${user.firstName} ${user.lastName}`, avatar: null },
      date: new Date().toISOString(),
      content: content.trim(),
      comments: [],
      reactions: [],
    });

    setContent("");
  };

  if (!user) return <></>;

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Napisz coś..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
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