import { useState, useCallback } from "react";
import { Reaction } from "../data/opinions";
import { ReactionType } from "../types/reaction";

interface UseReactionToggleOptions {
  reactions: Reaction[];
  onSave: (reactions: Reaction[]) => Promise<void>;
}

export function useReactionToggle({ reactions, onSave }: UseReactionToggleOptions) {
  const [localReactions, setLocalReactions] = useState(reactions);

  const toggle = useCallback(async (type: ReactionType, userId: string) => {
    if (!userId) return;

    const existing = localReactions.find((reaction) => reaction.type === type && reaction.userId === userId);
    let newReactions: Reaction[];
    
    if (existing) {
      newReactions = localReactions.filter((reaction) => !(reaction.type === type && reaction.userId === userId));
    } else {
      newReactions = [...localReactions, { type, userId }];
    }
    
    setLocalReactions(newReactions);
    await onSave(newReactions);
  }, [localReactions, onSave]);

  return { reactions: localReactions, toggle };
}