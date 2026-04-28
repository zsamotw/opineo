import { useState } from "react";

export function useUserId(): string {
  const [userId] = useState(() => {
    if (typeof window === "undefined") return "";
    const stored = window.localStorage.getItem("currentUser");
    if (!stored) return "";
    try {
      const user = JSON.parse(stored);
      return user?.id || "";
    } catch {
      return "";
    }
  });

  return userId;
}