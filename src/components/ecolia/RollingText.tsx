"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RollingTextProps {
  text: string;
  className?: string;
  textClassName?: string;
}

export function RollingText({ text, className, textClassName }: RollingTextProps) {
  return (
    <span className={cn("relative inline-flex overflow-hidden leading-tight group", className)}>
      <span
        className={cn(
          "inline-block transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full",
          textClassName
        )}
      >
        {text}
      </span>
      <span
        className={cn(
          "absolute top-full left-0 inline-block w-full transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full whitespace-nowrap",
          textClassName
        )}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}
