"use client";

import { useMemo, ReactNode } from "react";

interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className = "" }: AvatarProps) {
  const initial = useMemo(() => name.charAt(0).toUpperCase(), [name]);
  
  return (
    <div className={`flex items-center justify-center rounded-full bg-gray-300 font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-200 ${className}`}>
      {initial}
    </div>
  );
}

interface UserInfoProps {
  name: string;
  date: string;
  dateComponent?: ReactNode;
  className?: string;
}

export function UserInfo({ name, date, dateComponent, className = "" }: UserInfoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar name={name} className="h-10 w-10 text-base" />
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {dateComponent || date}
        </p>
      </div>
    </div>
  );
}