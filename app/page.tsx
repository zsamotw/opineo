"use client";

import { useOpinions } from "@/src/context/OpinionsContext";
import { OpinionFeedCard } from "@/src/components/opinions/OpinionFeedCard";
import { OpinionForm } from "@/src/components/OpinionForm";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-6xl">⚠️</div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Coś poszło nie tak
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Spróbuj odświeżyć stronę
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-6xl">📝</div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Brak opinii
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Dodaj pierwszą opinię, aby rozpocząć!
      </p>
    </div>
  );
}

export default function Home() {
  const { opinions, loading, isLoaded } = useOpinions();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <div className="flex flex-1 flex-col items-center py-12 px-4">
          <div className="w-full px-4 sm:px-8 flex flex-col gap-6">
            <OpinionForm />
            {opinions.length === 0 ? (
              <EmptyState />
            ) : (
              opinions.map((opinion) => (
                <OpinionFeedCard key={opinion.id} opinion={opinion} />
              ))
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}