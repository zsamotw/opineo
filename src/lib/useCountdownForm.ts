"use client";

import { useState, useEffect } from "react";

export function useCountdownForm(delaySeconds = 3) {
  const [showForm, setShowForm] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown === 0 || showForm) return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setShowForm(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, showForm]);

  const openForm = () => {
    if (showForm) {
      setShowForm(false);
      return;
    }
    if (countdown > 0) return;
    setCountdown(delaySeconds);
  };

  const closeForm = () => {
    setShowForm(false);
    setCountdown(0);
  };

  return { showForm, countdown, openForm, closeForm };
}