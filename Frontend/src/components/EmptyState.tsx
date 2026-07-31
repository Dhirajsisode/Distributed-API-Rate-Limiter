import React from 'react';
import { Database, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  isSearch?: boolean;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  isSearch = false,
  actionButton,
}) => {
  return (
    <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-slate-200/50 dark:border-zinc-800/50">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-800/20 text-slate-400 dark:text-zinc-500 mb-4">
        {isSearch ? <Search className="w-8 h-8" /> : <Database className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6">{description}</p>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
