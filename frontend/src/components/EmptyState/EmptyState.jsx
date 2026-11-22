import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No records found', message = 'No health records available yet.', actionText, onAction, icon: Icon = Inbox }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center flex flex-col items-center justify-center my-6 shadow-sm">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
