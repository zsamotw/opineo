"use client";

import { useState, useEffect } from "react";

interface FormattedDateProps {
  date: string;
  className?: string;
}

export function FormattedDate({ date, className = "" }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={className}>
        {new Date(date).toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    );
  }

  const { date: formattedDate, time } = formatDateTime(date);
  
  return (
    <span className={className}>
      {formattedDate}
      {time && <span className="ml-1">{time}</span>}
    </span>
  );
}

function formatDateTime(dateStr: string): { date: string; time: string } {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days < 1) {
    if (minutes < 1) return { date: "teraz", time: "" };
    if (minutes < 60) return { date: `${minutes}m temu`, time: "" };
    if (hours < 24) return { date: `${hours}g temu`, time: "" };
  }

  return {
    date: date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    }),
    time: date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }),
  };
}