"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useOpinions } from "@/src/context/OpinionsContext";
import { useAuth } from "@/src/context/AuthContext";
import { OpinionDetail } from "@/src/components/opinions/detail/OpinionDetail";

export default function OpinionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { opinions, isLoaded: opinionsLoaded } = useOpinions();
  const { isLoaded: authLoaded } = useAuth();

  if (!opinionsLoaded || !authLoaded) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </div>
    );
  }

  const opinion = opinions.find((o) => o.id === id);

  if (!opinion) {
    notFound();
  }

  return <OpinionDetail opinion={opinion} />;
}