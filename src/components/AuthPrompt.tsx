"use client";

import Link from "next/link";

interface AuthPromptProps {
  message?: string;
}

export function AuthPrompt({ message = "Zaloguj się lub zarejestruj, aby kontynuować" }: AuthPromptProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-4 text-base text-gray-700 dark:text-gray-300">{message}</p>
      <div className="flex justify-center gap-3">
        <Link
          href="/login"
          className="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          Zaloguj się
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}
