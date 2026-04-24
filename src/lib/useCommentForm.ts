"use client";

import { useState, useCallback } from "react";

interface UseCommentFormOptions {
  initialSelectedQuote?: string;
  onSubmit: (comment: {
    id: string;
    user: { name: string; avatar: string | null };
    date: string;
    agree: string;
    disagree: string;
    selectedQuote?: string;
  }) => void;
}

export function useCommentForm({ initialSelectedQuote = "", onSubmit }: UseCommentFormOptions) {
  const [agree, setAgree] = useState("");
  const [disagree, setDisagree] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(initialSelectedQuote);
  const [error, setError] = useState("");

  const hasAgree = agree.trim().length > 0 || selectedQuote;

  const validate = useCallback((): boolean => {
    setError("");

    if (!hasAgree && !disagree.trim()) {
      setError("Musisz wpisać z czym się zgadzasz lub nie zgadzasz");
      return false;
    }

    if (disagree.trim() && !hasAgree) {
      setError("Jeśli wyrażasz niezgodę, musisz najpierw wskazać z czym się zgadzasz");
      return false;
    }

    if (agree.trim().length > 500) {
      setError("Tekst zgody nie może przekraczać 500 znaków");
      return false;
    }

    if (disagree.trim().length > 500) {
      setError("Tekst niezgody nie może przekraczać 500 znaków");
      return false;
    }

    return true;
  }, [hasAgree, agree, disagree]);

  const submitWithId = useCallback(
    (prefix: string, user: { firstName: string; lastName: string } | null) => {
      if (!user) return;
      if (!validate()) return;

      onSubmit({
        id: `${prefix}${Date.now()}`,
        user: { name: `${user.firstName} ${user.lastName}`, avatar: null },
        date: new Date().toISOString(),
        agree: agree.trim(),
        disagree: disagree.trim(),
        selectedQuote: selectedQuote || undefined,
      });

      setAgree("");
      setDisagree("");
      setSelectedQuote("");
    },
    [agree, disagree, selectedQuote, validate, onSubmit]
  );

  const handleSubmit = useCallback(
    (user: { firstName: string; lastName: string } | null) => {
      submitWithId("c", user);
    },
    [submitWithId]
  );

  const handleReplySubmit = useCallback(
    (user: { firstName: string; lastName: string } | null) => {
      submitWithId("r", user);
    },
    [submitWithId]
  );

  const reset = useCallback(() => {
    setAgree("");
    setDisagree("");
    setSelectedQuote("");
    setError("");
  }, []);

  return {
    agree,
    disagree,
    selectedQuote,
    error,
    hasAgree,
    setAgree,
    setDisagree,
    setSelectedQuote,
    handleSubmit,
    handleReplySubmit,
    reset,
  };
}