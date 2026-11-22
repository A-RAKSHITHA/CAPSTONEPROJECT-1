import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { TrendingUp, PieChart, Activity, CheckCircle2, Clock, Calendar, RefreshCw } from 'lucide-react';

const AdminTrends = () => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getTrends();
      setTrends(res.data);
    } catch (err) {
      setError('Unable to load district trends.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  if (loading) {
    return <Loading message="Analyzing district health trends and follow-up trajectories..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTrends} />;
  }

  const totalAssessments = trends?.totalAssessments || 0;
  const priorityCount = trends?.priorityReviews || 0;
  const standardCount = Math.max(0, totalAssessments - priorityCount);

  const priorityPct = totalAssessments > 0 ? Math.round((priorityCount / totalAssessments) * 100) : 0;
  const standardPct = totalAssessments > 0 ? 100 - priorityPct : 0;

  const pendingFollowups = trends?.pendingFollowups || 0;
  const completedFollowups = trends?.completedFollowups || 0;
  const totalFollowups = pendingFollowups + completedFollowups;
  const completedPct = totalFollowups > 0 ? Math.round((completedFollowups / totalFollowups) * 100) : 0;
  const pendingPct = totalFollowups > 0 ? 100 - completedPct : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
              <RuralVillageEmblem className="w-3.5 h-3.5" />
              <span>Big Data Rural CKD Surveillance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">District Health Trends & Trajectory</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
              Population risk distribution, follow-up progression rate, and continuous rural care dynamic analysis.
            </p>
          </div>

          <button
            onClick={fetchTrends}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-semibold rounded-2xl transition-all inline-flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Trends</span>
          </button>
        </div>
      </div>

      {/* Grid of Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">Community Risk Breakdown</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              {totalAssessments} Total
            </span>
          </div>

          <div className="space-y-4">
            {/* Visual Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${standardPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Standard: ${standardPct}%`}
              />
              <div
                style={{ width: `${priorityPct}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Priority: ${priorityPct}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span>Standard Risk</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-950 mt-1">{standardCount}</div>
                <div className="text-xs text-emerald-700 mt-0.5">{standardPct}% of population</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span>Priority Review</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-950 mt-1">{priorityCount}</div>
                <div className="text-xs text-amber-700 mt-0.5">{priorityPct}% of population</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
            Community members flagged with priority review are immediately escalated to assigned village ANM health workers for targeted diet, hydration, and medical checkups.
          </p>
        </div>

        {/* Follow-up Resolution Dynamics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">Follow-Up Care Trajectory</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              {totalFollowups} Actions
            </span>
          </div>

          <div className="space-y-4">
            {/* Visual Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${completedPct}%` }}
                className="bg-teal-600 h-full transition-all duration-500"
                title={`Completed: ${completedPct}%`}
              />
              <div
                style={{ width: `${pendingPct}%` }}
                className="bg-amber-400 h-full transition-all duration-500"
                title={`Pending: ${pendingPct}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="flex items-center space-x-2 text-teal-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Resolved / Completed</span>
                </div>
                <div className="text-2xl font-extrabold text-teal-950 mt-1">{completedFollowups}</div>
                <div className="text-xs text-teal-700 mt-0.5">{completedPct}% adherence</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pending / Scheduled</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-950 mt-1">{pendingFollowups}</div>
                <div className="text-xs text-amber-700 mt-0.5">{pendingPct}% awaiting review</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
            Health workers continuously manage follow-up appointments and verify adherence to nutritional recommendations and medication protocols.
          </p>
        </div>
      </div>

      {/* District Community Care Timeline and Continuous Loop */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">End-to-End Community Health Flow Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-teal-800">1. COLLECT & ASSESS</span>
            <div className="text-sm font-semibold text-slate-900 mt-1">24 Kaggle Indicators</div>
            <div className="text-xs text-slate-500 mt-0.5">Community checkups</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-teal-800">2. PRIORITIZE</span>
            <div className="text-sm font-semibold text-slate-900 mt-1">ML Risk Flagging</div>
            <div className="text-xs text-slate-500 mt-0.5">Decision-support</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-teal-800">3. CONNECT & REVIEW</span>
            <div className="text-sm font-semibold text-slate-900 mt-1">Telugu / Voice Comms</div>
            <div className="text-xs text-slate-500 mt-0.5">Health worker care</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-teal-800">4. MONITOR</span>
            <div className="text-sm font-semibold text-slate-900 mt-1">My Health Journey</div>
            <div className="text-xs text-slate-500 mt-0.5">Continuous tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrends;
