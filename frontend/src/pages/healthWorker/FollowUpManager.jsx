import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthWorkerApi } from '../../api/healthWorkerApi';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { CalendarCheck, ChevronRight, Clock, CheckCircle2, User, AlertTriangle } from 'lucide-react';

const FollowUpManager = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await healthWorkerApi.getFollowups();
      setFollowups(res.data || []);
    } catch (err) {
      setError('Unable to load follow-up schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const filtered = filter === 'ALL'
    ? followups
    : followups.filter((f) => f.status === filter);

  if (loading) {
    return <Loading message="Loading community follow-up schedules..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchFollowups} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Follow-up Management</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Review and schedule community checkups, dietary plans, and clinical renal follow-ups.
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          {['ALL', 'Pending', 'Contacted', 'Follow-up Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-4 px-4 sm:px-6">Community Member</th>
                <th className="py-4 px-4 sm:px-6">Status</th>
                <th className="py-4 px-4 sm:px-6">Follow-up Date</th>
                <th className="py-4 px-4 sm:px-6">Next Checkup</th>
                <th className="py-4 px-4 sm:px-6">Remarks & Actions</th>
                <th className="py-4 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No follow-ups matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((fu) => (
                  <tr key={fu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <UserAvatar
                          user={fu.user}
                          role="ROLE_USER"
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{fu.user?.fullName}</div>
                          <div className="text-[11px] text-slate-400">{fu.user?.villageCommunity}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        fu.status === 'Follow-up Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : fu.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {fu.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs text-slate-600">
                      {fu.followupDate ? new Date(fu.followupDate).toLocaleDateString() : 'Recorded'}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs font-bold text-teal-800">
                      {fu.nextFollowupDate ? new Date(fu.nextFollowupDate).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs max-w-xs truncate text-slate-600">
                      {fu.remarks || fu.actionTaken || 'Renal follow-up recorded.'}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <Link
                        to={`/nurse/members/${fu.user?.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors"
                      >
                        <span>Update</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FollowUpManager;
