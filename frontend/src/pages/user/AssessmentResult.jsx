import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { predictionApi } from '../../api/predictionApi';
import PredictionCard from '../../components/PredictionCard/PredictionCard';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { KidneyIcon, RuralVillageEmblem, HydrationDrop, RuralKidneyBanner } from '../../components/KidneyVisuals/KidneyVisuals';
import { ArrowLeft, MessageSquare, History, CalendarCheck, ShieldCheck, Droplets, HeartPulse, PhoneCall } from 'lucide-react';

const AssessmentResult = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(location.state?.assessment || null);
  const [loading, setLoading] = useState(!assessment);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assessment && user?.id) {
      const fetchLatest = async () => {
        try {
          setLoading(true);
          const res = await predictionApi.getLatestAssessment(user.id);
          setAssessment(res.data);
        } catch (err) {
          setError('Unable to load latest assessment results.');
        } finally {
          setLoading(false);
        }
      };
      fetchLatest();
    }
  }, [assessment, user?.id]);

  if (loading) {
    return <Loading message="Loading your latest kidney health assessment..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!assessment) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <KidneyIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No Assessment Record Found</h3>
        <p className="text-slate-500 mb-6 text-sm">Complete your first rural kidney health check to receive instant risk evaluation.</p>
        <Link
          to="/user/health-assessment"
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm shadow-sm inline-flex items-center space-x-2"
        >
          <KidneyIcon className="w-4 h-4" />
          <span>Complete Kidney Health Check</span>
        </Link>
      </div>
    );
  }

  const isPriority = assessment.priorityReview || assessment.assessmentResult === 'Increased Risk';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <Link
          to="/user/health-assessment"
          className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200"
        >
          <KidneyIcon className="w-3.5 h-3.5" />
          <span>+ New Health Check</span>
        </Link>
      </div>

      {/* Rural CKD Assessment Context Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 opacity-10 pointer-events-none">
          <KidneyIcon className="w-64 h-64" filled />
        </div>
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
            <RuralVillageEmblem className="w-3.5 h-3.5" />
            <span>Rural Kidney Health Risk Evaluation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Assessment Outcome & Care Guidance
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
            Evaluated using dual machine learning models (Random Forest & Logistic Regression) on 24 validated renal indicators.
          </p>
        </div>
      </div>

      {/* Main Assessment Presentation Card */}
      <PredictionCard assessment={assessment} showFollowUpLink={false} />

      {/* Renal Advisory & Hydration Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-teal-50/70 border border-teal-200/80 rounded-3xl space-y-2.5">
          <div className="flex items-center space-x-2 text-teal-900 font-bold text-sm">
            <HydrationDrop className="w-5 h-5 text-teal-700" />
            <span>Daily Hydration & Electrolyte Care</span>
          </div>
          <p className="text-xs text-teal-800/90 leading-relaxed">
            In warm rural environments, adequate clean water intake (2–3 litres/day) prevents acute renal stress. Moderate sodium and avoid excessive over-the-counter painkillers (NSAIDs) without nurse consultation.
          </p>
        </div>

        <div className="p-5 bg-sky-50/70 border border-sky-200/80 rounded-3xl space-y-2.5">
          <div className="flex items-center space-x-2 text-sky-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <span>Health Worker Decision Support</span>
          </div>
          <p className="text-xs text-sky-800/90 leading-relaxed">
            This risk indicator has been synchronized with ANM Sister Lakshmi's triage dashboard. If follow-up or routine BP checks are needed, she will reach out directly.
          </p>
        </div>
      </div>

      {/* Post Assessment Next Steps */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <span>Recommended Next Actions</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to="/user/follow-ups"
            className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-2xl transition-all flex flex-col justify-between"
          >
            <div>
              <CalendarCheck className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="font-semibold text-slate-800">Check Follow-up Status</div>
              <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                Review triage remarks and dietary timeline recorded by your assigned health worker.
              </p>
            </div>
            <span className="font-semibold text-emerald-700 mt-3 block">View Timeline →</span>
          </Link>

          <Link
            to="/user/messages"
            className="p-4 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-2xl transition-all flex flex-col justify-between"
          >
            <div>
              <MessageSquare className="w-5 h-5 text-teal-600 mb-2" />
              <div className="font-semibold text-slate-800">Message Health Worker</div>
              <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                Consult ANM Sister Lakshmi in Telugu or English with microphone voice input.
              </p>
            </div>
            <span className="font-semibold text-teal-700 mt-3 block">Start Chat →</span>
          </Link>

          <Link
            to="/user/history"
            className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl transition-all flex flex-col justify-between"
          >
            <div>
              <History className="w-5 h-5 text-indigo-600 mb-2" />
              <div className="font-semibold text-slate-800">My Health Journey</div>
              <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                Inspect your chronological kidney biomarker history and trend over time.
              </p>
            </div>
            <span className="font-semibold text-indigo-700 mt-3 block">View Journey →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
