import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { KidneyIcon, RuralVillageEmblem, HydrationDrop } from '../../components/KidneyVisuals/KidneyVisuals';
import {
  History,
  CalendarCheck,
  Clock,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Sparkles
} from 'lucide-react';

const HealthJourney = () => {
  const { user } = useAuth();
  const [journeyData, setJourneyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJourney = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await userApi.getHealthJourney(user.id);
      setJourneyData(res.data);
    } catch (err) {
      setError('Unable to load your health journey history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, [user?.id]);

  if (loading) {
    return <Loading message="Loading your kidney health journey..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchJourney} />;
  }

  const timeline = journeyData?.timeline || [];
  const records = journeyData?.records || [];
  const predictions = journeyData?.predictions || [];
  const followUps = journeyData?.followUps || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <KidneyIcon className="w-7 h-7 text-teal-700" filled />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Health Journey</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Continuous Care
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Longitudinal tracking of your kidney health assessments, lifestyle updates, and health worker reviews.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold self-start sm:self-center">
          <RuralVillageEmblem className="w-3.5 h-3.5 text-teal-700" />
          <span>{records.length} Recorded Checkups</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-teal-700" />
          <span>Chronological Health & Renal Vitals Progression</span>
        </h2>

        {records.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-slate-400">
            <KidneyIcon className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No Checkups Recorded Yet</p>
            <p className="text-xs">Complete your first Kidney Health Check to begin building your health journey.</p>
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-teal-200 space-y-8 my-4">
            {records.map((rec, idx) => {
              const matchingPred = predictions.find((p) => p.recordId === rec.id) || predictions[idx];
              const isPriority = matchingPred?.priorityReview;

              return (
                <div key={rec.id} className="relative group">
                  {/* Timeline Bullet */}
                  <div
                    className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                      isPriority ? 'bg-amber-500 text-white' : 'bg-teal-700 text-white'
                    }`}
                  >
                    <KidneyIcon className="w-3.5 h-3.5" filled />
                  </div>

                  <div className="p-5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Kidney Assessment #{rec.id}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(rec.recordedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>

                      {matchingPred && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 ${
                            isPriority
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          <KidneyIcon className="w-3 h-3" filled />
                          <span>{matchingPred.assessmentResult || (isPriority ? 'Increased Risk' : 'Low Risk')}</span>
                        </span>
                      )}
                    </div>

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                        <span className="font-bold text-slate-800">{rec.bp ? `${rec.bp} mmHg` : 'N/A'}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-slate-400 block text-[10px]">Serum Creatinine</span>
                        <span className="font-bold text-slate-800">{rec.sc ? `${rec.sc} mg/dL` : 'N/A'}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-slate-400 block text-[10px]">Blood Glucose</span>
                        <span className="font-bold text-slate-800">{rec.bgr ? `${rec.bgr} mg/dL` : 'N/A'}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                        <span className="text-slate-400 block text-[10px]">Hemoglobin</span>
                        <span className="font-bold text-slate-800">{rec.hemo ? `${rec.hemo} g/dL` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthJourney;
