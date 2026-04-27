"use client";

import { useMemo } from "react";
import { useOpinions } from "../context/OpinionsContext";

export function useOpinion(opinionId: string) {
  const { opinions } = useOpinions();

  return useMemo(() => {
    return opinions.find((opinion) => opinion.id === opinionId) ?? null;
  }, [opinions, opinionId]);
}