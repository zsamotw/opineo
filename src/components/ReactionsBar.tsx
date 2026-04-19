"use client";

import { Reaction } from "../data/opinions";
import { ReactionType } from "../types/reaction";

interface ReactionsBarProps {
  reactions: Reaction[];
  onToggle: (type: ReactionType) => void;
  userId?: string;
  size?: "sm" | "md";
}

const REACTION_CONFIG: Record<ReactionType, { emoji: string; label: string; activeClass: string; inactiveClass: string }> = {
  appreciate: { emoji: "🦉", label: "Doceniam", activeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", inactiveClass: "bg-gray-100 text-gray-600 hover:bg-amber-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-amber-900/20" },
  changed: { emoji: "🔁", label: "Zmieniłem zdanie", activeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", inactiveClass: "bg-gray-100 text-gray-600 hover:bg-purple-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-purple-900/20" },
  connect: { emoji: "🤝", label: "To nas łączy", activeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", inactiveClass: "bg-gray-100 text-gray-600 hover:bg-blue-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-blue-900/20" },
};

const SIZE_CONFIG = {
  sm: { gap: "gap-0.5", padding: "px-1.5 py-1", emoji: "text-xs", count: "text-xs" },
  md: { gap: "gap-1", padding: "px-3 py-2", emoji: "text-lg", count: "text-sm" },
};

export function ReactionsBar({ reactions, onToggle, userId = "", size = "md" }: ReactionsBarProps) {
  const reactionTypes: ReactionType[] = ["appreciate", "changed", "connect"];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div className={`flex items-center ${sizeConfig.gap}`}>
      {reactionTypes.map((type) => {
        const config = REACTION_CONFIG[type];
        const count = reactions.filter((reaction) => reaction.type === type).length;
        const isActive = reactions.some((reaction) => reaction.type === type && reaction.userId === userId);

        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            aria-label={config.label}
            title={config.label}
            className={`flex items-center ${sizeConfig.padding} rounded-full transition-colors cursor-pointer text-sm ${
              isActive ? config.activeClass : config.inactiveClass
            }`}
          >
            <span className={sizeConfig.emoji}>{config.emoji}</span>
            {count > 0 && <span className={sizeConfig.count}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}