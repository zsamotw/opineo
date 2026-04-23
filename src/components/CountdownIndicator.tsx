interface CountdownIndicatorProps {
  countdown: number;
}

export function CountdownIndicator({ countdown }: CountdownIndicatorProps) {
  if (countdown <= 0) return null;

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 text-xs font-bold text-blue-600 dark:border-blue-400 dark:text-blue-400 sm:h-8 sm:w-8 sm:text-sm">
        {countdown}
      </span>
      <span className="text-base text-gray-500 dark:text-gray-400">
        Nie spiesz się — jakość ponad szybkość
      </span>
    </div>
  );
}