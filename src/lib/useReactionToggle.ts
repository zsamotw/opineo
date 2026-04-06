import { useState, useCallback } from "react";
import { Reaction } from "../data/opinions";

export type ReactionType = "appreciate" | "changed" | "connect";

interface UseReactionToggleOptions {
  reactions: Reaction[];
  onSave: (reactions: Reaction[]) => Promise<void>;
}

export function useReactionToggle({ reactions, onSave }: UseReactionToggleOptions) {
  const [localReactions, setLocalReactions] = useState(reactions);

  const toggle = useCallback(async (type: ReactionType, userId: string) => {
    if (!userId) return;

    const existing = localReactions.find((r) => r.type === type && r.userId === userId);
    let newReactions: Reaction[];
    
    if (existing) {
      newReactions = localReactions.filter((r) => !(r.type === type && r.userId === userId));
    } else {
      newReactions = [...localReactions, { type, userId }];
    }
    
    setLocalReactions(newReactions);
    await onSave(newReactions);
  }, [localReactions, onSave]);

  return { reactions: localReactions, toggle };
}