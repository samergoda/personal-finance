import React from "react";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-300">
        Empty
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          className="mt-5 rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm hover:bg-slate-700"
          onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
