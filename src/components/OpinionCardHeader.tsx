"use client";

import { Avatar } from "./Avatar";
import { FormattedDate } from "./FormattedDate";

interface OpinionCardHeaderProps {
  name: string;
  date: string;
}

export function OpinionCardHeader({ name, date }: OpinionCardHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <Avatar name={name} className="h-12 w-12 text-lg" />
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{name}</p>
        <FormattedDate date={date} className="text-sm" />
      </div>
    </div>
  );
}