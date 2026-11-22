import React from 'react';
import { Bell, MessageSquare, AlertTriangle, CalendarCheck, HeartPulse, Check, RefreshCw } from 'lucide-react';

const NotificationPanel = ({ notifications = [], onMarkAsRead, onRefresh, isLoading = false }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'PRIORITY_REVIEW':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'FOLLOW_UP':
      case 'REMINDER':
        return <CalendarCheck className="w-4 h-4 text-blue-600" />;
      case 'ASSESSMENT':
      case 'HEALTH_UPDATE':
        return <HeartPulse className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Alerts & Reminders</h3>
          <p className="text-xs text-slate-400">Database-backed timely updates and health notifications</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            title="Refresh alerts"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No alerts at this moment. You are up to date!
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = notif.status === 'unread';
            return (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between space-x-3 transition-colors ${
                  isUnread ? 'bg-emerald-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <p className={`text-sm leading-relaxed ${isUnread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleString()} • {notif.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {isUnread && onMarkAsRead && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex-shrink-0 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
