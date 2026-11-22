import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading your health information...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
      <p className="text-slate-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;
