"use client";

import { Avatar } from "./Avatar";
import { FormattedDate } from "./FormattedDate";

interface OpinionCardHeaderProps {
  name: string;
  date: string;
}

export function OpinionCardHeader({ name, date }: OpinionCardHeaderProps) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <Avatar name={name} className="h-8 w-8 text-sm" />
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</p>
        <FormattedDate date={date} className="text-xs" />
      </div>
    </div>
  );
}