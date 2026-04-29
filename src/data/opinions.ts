export interface CommentReply {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  date: string;
  agree: string;
  disagree: string;
  reactions: Reaction[];
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  date: string;
  agree: string;
  disagree: string;
  selectedQuote?: string;
  replies: CommentReply[];
  reactions: Reaction[];
}

import { ReactionType } from "@/src/types/reaction";

export interface Reaction {
  type: ReactionType;
  userId: string;
}

export interface Opinion {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  date: string;
  content: string;
  comments: Comment[];
  reactions: Reaction[];
}

export interface OpinionSummary {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  date: string;
  content: string;
  reactions: Reaction[];
  agreeCount: number;
  disagreeCount: number;
  quotes: string[];
}

export function getOpinionSummary(opinion: Opinion): OpinionSummary {
  return {
    id: opinion.id,
    user: opinion.user,
    date: opinion.date,
    content: opinion.content,
    reactions: opinion.reactions,
    agreeCount: opinion.comments.filter((c) => c.agree?.trim()).length,
    disagreeCount: opinion.comments.filter((c) => c.disagree?.trim()).length,
    quotes: opinion.comments
      .filter((c) => c.selectedQuote?.trim())
      .map((c) => c.selectedQuote!),
  };
}