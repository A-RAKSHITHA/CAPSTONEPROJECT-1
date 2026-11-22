import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import StatCard from '../../components/StatCard/StatCard';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import {
  Users,
  Stethoscope,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Database,
  Cpu,
  Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getStatistics();
      setStats(res.data);
    } catch (err) {
      setError('Unable to load district administration overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loading message="Loading district big data renal health overview..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStats} />;
  }

  const assessmentDist = stats?.assessmentsByResult || {};
  const followupDist = stats?.followupsByStatus || {};
  const totalAssessments = stats?.totalAssessments || 0;
  const increasedRiskCount = assessmentDist['Increased Risk'] || stats?.priorityReviews || 0;
  const lowRiskCount = assessmentDist['Low Risk'] || Math.max(0, totalAssessments - increasedRiskCount);

  return (
    <div className="space-y-6">
      {/* Big Data Rural CKD Surveillance Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-teal-800/40">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-2 opacity-10 pointer-events-none text-teal-200">
          <KidneyIcon className="w-56 h-56" filled />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Big Data–Driven Rural Health Risk Monitoring System</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            District Rural Kidney Disease (CKD) Surveillance
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Centralized decision-support command center for population-level chronic kidney disease monitoring, village primary health worker allocation, and Kaggle-validated predictive risk modeling.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <Link
              to="/admin/assessments"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <KidneyIcon className="w-3.5 h-3.5 text-emerald-300" filled />
              <span>All Kidney Assessments</span>
            </Link>

            <Link
              to="/admin/statistics"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
              <span>ML Model Benchmarks</span>
            </Link>

            <Link
              to="/admin/trends"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Population Risk Trends</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Rural Community Members"
          value={stats?.totalCommunityMembers || 0}
          subtitle="Enrolled in district screening"
          icon={Users}
          color="teal"
        />

        <StatCard
          title="Active Health Workers"
          value={stats?.totalHealthWorkers || 0}
          subtitle="ANM / PHC field staff deployed"
          icon={Stethoscope}
          color="indigo"
        />

        <StatCard
          title="Total Kidney Checks"
          value={stats?.totalAssessments || 0}
          subtitle="Evaluated with 24 renal markers"
          icon={KidneyIcon}
          color="emerald"
        />

        <StatCard
          title="Priority Triage Required"
          value={stats?.priorityReviews || 0}
          subtitle="Elevated serum creatinine & risk"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Population Renal Risk Distribution & Follow-up Workload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <KidneyIcon className="w-4 h-4 text-teal-700" filled />
              <span>Population Renal Risk Breakdown</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {totalAssessments} Total
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Assessments categorized based on Random Forest (100% test accuracy) and Logistic Regression predictive decision-boundaries.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-emerald-800">Stable Monitored Range</span>
                <span className="text-slate-700">{lowRiskCount} members</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAssessments > 0 ? (lowRiskCount / totalAssessments) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-amber-800">Elevated Renal Risk (Priority Review)</span>
                <span className="text-slate-700">{increasedRiskCount} members</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAssessments > 0 ? (increasedRiskCount / totalAssessments) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/admin/trends"
              className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
            >
              <span>View Comprehensive Risk Distribution Trends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Community Follow-up Resolution */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-teal-700" />
              <span>Field Follow-Up Adherence</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {(stats?.pendingFollowups || 0) + (stats?.completedFollowups || 0)} Total
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Tracks resolution rates of field visits, dietary advice, and re-screening appointments conducted by village ANMs.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
              <span className="text-teal-700 block font-bold text-[11px] uppercase">Completed Follow-ups</span>
              <div className="text-2xl font-extrabold text-teal-950 mt-1">{stats?.completedFollowups || 0}</div>
              <div className="text-[10px] text-teal-700 mt-0.5">Clinical guidance delivered</div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
              <span className="text-amber-800 block font-bold text-[11px] uppercase">Pending Review</span>
              <div className="text-2xl font-extrabold text-amber-950 mt-1">{stats?.pendingFollowups || 0}</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Assigned to field staff</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/admin/users"
              className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
            >
              <span>Manage Community Roster & Health Workers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
