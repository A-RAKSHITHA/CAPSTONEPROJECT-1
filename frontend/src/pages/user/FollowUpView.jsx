import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { followupApi } from '../../api/followupApi';
import FollowUpCard from '../../components/FollowUpCard/FollowUpCard';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { CalendarCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';

const FollowUpView = () => {
  const { user } = useAuth();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFollowUps = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await followupApi.getUserFollowUps(user.id);
      setFollowUps(res.data || []);
    } catch (err) {
      setError('Unable to load follow-up records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [user?.id]);

  if (loading) {
    return <Loading message="Loading follow-up records..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchFollowUps} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
            <RuralVillageEmblem className="w-3.5 h-3.5" />
            <span>Community Health Worker Follow-up</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Follow-up Care & Appointments</h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
            Review recommendations, hydration directives, and follow-up schedules recorded by your designated village ANM health worker.
          </p>
        </div>
      </div>

      {followUps.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3 shadow-sm">
          <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Pending Follow-ups</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Your assessments are monitored by your assigned community health worker. When action or review is recorded, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {followUps.map((fu) => (
            <FollowUpCard key={fu.id} followUp={fu} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowUpView;
