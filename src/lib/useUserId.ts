import { useMemo } from "react";

export function useUserId(): string {
  return useMemo(() => {
    const stored = window.localStorage.getItem("currentUser");
    if (!stored) return "";
    try {
      const user = JSON.parse(stored);
      return user?.id || "";
    } catch {
      return "";
    }
  }, []);
}