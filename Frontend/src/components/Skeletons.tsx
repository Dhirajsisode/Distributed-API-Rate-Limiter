import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-24"></div>
        <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded-lg w-8"></div>
      </div>
      <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-16"></div>
      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-32"></div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 overflow-hidden animate-pulse">
      <div className="bg-slate-100 dark:bg-zinc-900/60 p-4 flex justify-between space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-zinc-900">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-5 flex justify-between space-x-4">
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/5"></div>
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-32"></div>
          <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-48"></div>
        </div>
        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-16"></div>
      </div>
      <div className="h-64 bg-slate-100 dark:bg-zinc-900/40 rounded-xl flex items-end justify-between p-4 space-x-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const heights = ['h-1/3', 'h-2/3', 'h-1/2', 'h-5/6', 'h-1/4', 'h-3/4', 'h-1/2', 'h-2/3', 'h-5/6', 'h-1/3', 'h-3/4', 'h-1/2'];
          return (
            <div key={i} className={`w-full ${heights[i]} bg-slate-200 dark:bg-zinc-800 rounded-t-md`}></div>
          );
        })}
      </div>
    </div>
  );
};
export default CardSkeleton;
