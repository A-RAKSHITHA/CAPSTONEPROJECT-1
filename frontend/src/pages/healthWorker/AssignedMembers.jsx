import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthWorkerApi } from '../../api/healthWorkerApi';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Users, ChevronRight, MessageSquare, HeartPulse, User, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AssignedMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await healthWorkerApi.getAssignedMembers();
      setMembers(res.data || []);
    } catch (err) {
      setError('Unable to load assigned community members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return <Loading message="Loading monitored community members..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchMembers} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Users className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Community</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Rural community members monitored under your assigned village Primary Health Centre.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3.5 py-1.5 bg-teal-50 text-teal-800 rounded-full border border-teal-200 self-start sm:self-center">
          {members.length} Members Monitored
        </span>
      </div>

      {/* Grid of Community Cards with Profile Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-400 rounded-3xl border border-slate-200/90">
            No community members currently assigned to this health worker.
          </div>
        ) : (
          members.map((item) => {
            const u = item.user;
            const pred = item.latestPrediction;
            const fu = item.latestFollowUp;
            const isPriority = pred?.priorityReview;

            return (
              <div
                key={u.id}
                className={`bg-white p-6 rounded-3xl border ${
                  isPriority
                    ? 'border-amber-300 ring-2 ring-amber-100 shadow-sm'
                    : 'border-slate-200/90 shadow-xs'
                } flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
              >
                <div>
                  {/* Top: Avatar, Name, and Priority Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        user={u}
                        role="ROLE_USER"
                        size="lg"
                        className={isPriority ? 'ring-2 ring-amber-400' : 'ring-1 ring-slate-200'}
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                          {u.fullName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {u.villageCommunity}, {u.district}
                        </p>
                      </div>
                    </div>

                    {isPriority && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                        Priority
                      </span>
                    )}
                  </div>

                  {/* Renal Biomarkers & Survey Metrics */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Demographics</span>
                      <span className="font-semibold text-slate-700">
                        {u.age ? `${u.age} yrs` : '—'}, {u.gender || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Kidney Risk</span>
                      <span
                        className={`font-bold flex items-center space-x-1 ${
                          isPriority ? 'text-amber-800' : 'text-emerald-700'
                        }`}
                      >
                        <KidneyIcon className="w-3 h-3" filled />
                        <span>{pred?.assessmentResult || 'Routine'}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Contact</span>
                      <span className="font-semibold text-slate-700">{u.phoneNumber}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Follow-Up</span>
                      <span className="font-semibold text-slate-700">{fu?.status || 'Active'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/nurse/members/${u.id}`}
                    className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
                  >
                    <span>Inspect Health Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/nurse/messages?userId=${u.id}`}
                    className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl transition-colors"
                    title="Send Telugu/English Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssignedMembers;
