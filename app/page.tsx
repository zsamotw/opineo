"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useOpinions } from "@/src/context/OpinionsContext";
import { OpinionFeedCard } from "@/src/components/opinions/OpinionFeedCard";
import { OpinionForm } from "@/src/components/OpinionForm";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { ThemeToggle } from "@/src/components/ThemeToggle";

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

function Navbar() {
  const { user, logout, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800" suppressHydrationWarning>
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Opineo
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Zalogowany jako: <strong>{user.firstName} {user.lastName}</strong>
              </span>
              <button
                onClick={logout}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                Zaloguj
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
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
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <Navbar />
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