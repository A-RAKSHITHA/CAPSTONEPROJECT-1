import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Unable to load your health information. Please try again.', onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 my-4 text-rose-800 flex items-start justify-between shadow-sm">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-rose-900 text-sm">Notice</h4>
          <p className="text-sm mt-0.5 text-rose-700">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition-colors ml-4 flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
