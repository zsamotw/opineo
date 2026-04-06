export interface CommentReply {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  date: string;
  agree: string;
  disagree: string;
  selectedQuote?: string;
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

export interface Reaction {
  type: "appreciate" | "changed" | "connect";
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