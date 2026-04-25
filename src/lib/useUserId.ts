import { useState, useEffect } from "react";

export function useUserId(): string {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const stored = window.localStorage.getItem("currentUser");
    if (!stored) {
      setUserId("");
      return;
    }
    try {
      const user = JSON.parse(stored);
      setUserId(user?.id || "");
    } catch {
      setUserId("");
    }
  }, []);

  return userId;
}