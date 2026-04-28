"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
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
