import React from 'react';

interface DividerProps {
  text?: string;
}

export default function Divider({ text }: DividerProps) {
  if (!text) {
    return <hr className="border-border" />;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-sm text-secondary whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
