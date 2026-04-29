import { useAuth } from "@/src/context/AuthContext";
import { useMemo } from "react";

export function useUserId(): string {
  const { user } = useAuth();
  return useMemo(() => user?.id || "", [user]);
}