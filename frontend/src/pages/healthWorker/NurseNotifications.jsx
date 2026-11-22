import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../api/notificationApi';
import NotificationPanel from '../../components/NotificationPanel/NotificationPanel';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Bell } from 'lucide-react';
import { RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';

const NurseNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await notificationApi.getNurseAlerts(user.id);
      setNotifications(res.data || []);
    } catch (err) {
      setError('Unable to load health worker alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user?.id]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      );
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
            <RuralVillageEmblem className="w-3.5 h-3.5" />
            <span>Health Worker Field Triage Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Triage Alerts & Notifications</h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
            Priority review escalations for high-risk members, follow-up milestones, and new community messages.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAlerts} />}

      {loading ? (
        <Loading message="Loading health worker alerts..." />
      ) : (
        <NotificationPanel
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onRefresh={fetchAlerts}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default NurseNotifications;
