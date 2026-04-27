"use client";

import { useRouter } from "next/navigation";
import { getOpinionSummary, Opinion } from "@/src/data/opinions";
import { ReactionsBar } from "@/src/components/ReactionsBar";
import { OpinionSummaryStats } from "@/src/components/opinions/summary/OpinionSummaryStats";
import { useOpinions } from "@/src/context/OpinionsContext";
import { useUserId } from "@/src/lib/useUserId";
import { ReactionType } from "@/src/types/reaction";

interface OpinionFeedCardProps {
  opinion: Opinion;
}

export function OpinionFeedCard({ opinion }: OpinionFeedCardProps) {
  const summary = getOpinionSummary(opinion);
  const userId = useUserId();
  const router = useRouter();
  const { toggleOpinionReaction } = useOpinions();

  const handleReaction = async (type: ReactionType) => {
    if (!userId) return;
    await toggleOpinionReaction(opinion.id, [type], userId);
  };

  const handleCardClick = () => {
    router.push(`/opinions/${opinion.id}`);
  };

  return (
    <div className="rounded-lg border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 w-full">
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {opinion.user.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(opinion.date).toLocaleDateString("pl-PL")}
          </span>
        </div>
        <p className="mb-3 text-base leading-normal text-gray-800 dark:text-gray-200 select-text">
          {opinion.content}
        </p>
      </div>
      <ReactionsBar
        reactions={opinion.reactions || []}
        onToggle={handleReaction}
        userId={userId}
        size="lg"
      />
      <OpinionSummaryStats summary={summary} />
    </div>
  );
}