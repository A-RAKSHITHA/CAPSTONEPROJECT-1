import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { lifestyleApi } from '../../api/lifestyleApi';
import LifestyleForm from '../../components/LifestyleForm/LifestyleForm';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Apple, History, Calendar, Droplets, Footprints, Moon, Cigarette, Wine, CheckCircle2 } from 'lucide-react';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';

const Lifestyle = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await lifestyleApi.getHistory(user.id);
      setHistory(res.data || []);
    } catch (err) {
      setError('Unable to load lifestyle records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      await lifestyleApi.saveRecord({
        ...formData,
        userId: user.id,
      });

      setSuccessMsg('Your lifestyle habits have been recorded and added to your chronological health journey.');
      fetchHistory();
    } catch (err) {
      setError('Unable to save lifestyle record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-6 opacity-10 pointer-events-none">
          <KidneyIcon className="w-64 h-64" filled />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
            <RuralVillageEmblem className="w-3.5 h-3.5" />
            <span>Rural Kidney Wellness & Hydration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Daily Lifestyle Records</h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-2xl">
            Hydration, salt intake, physical exertion in rural agricultural fields, and sleep patterns significantly influence blood pressure and long-term renal health.
          </p>
        </div>
      </div>

      {/* Renal Habits Advice Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-teal-900">Hydration in Fields</div>
            <div className="text-[11px] text-teal-700">Drink 2.5–3L safe water during sun hours</div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-emerald-900">Low Sodium Diet</div>
            <div className="text-[11px] text-emerald-700">Moderate salt & pickles to protect BP</div>
          </div>
        </div>

        <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            <KidneyIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-sky-900">Safe Pain Relief</div>
            <div className="text-[11px] text-sky-700">Avoid unprescribed NSAIDs for aches</div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Entry Form */}
      <LifestyleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {/* Historical Records (Section 32) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <History className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-800 text-base">Lifestyle Record History</h3>
        </div>

        {loading ? (
          <Loading message="Loading lifestyle record history..." />
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No lifestyle records saved yet. Submit your first record above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(rec.recordedAt).toLocaleDateString()}</span>
                  </span>
                  <span className="text-slate-400">
                    {new Date(rec.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Food Habits</span>
                    <span className="font-semibold text-slate-800">{rec.foodHabits}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Water Intake</span>
                    <span className="font-semibold text-slate-800">{rec.waterIntake}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Physical Activity</span>
                    <span className="font-semibold text-slate-800">{rec.physicalActivity}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Exercise</span>
                    <span className="font-semibold text-slate-800">{rec.exerciseFrequency}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Sleep Duration</span>
                    <span className="font-semibold text-slate-800">{rec.sleepDuration}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Smoking</span>
                    <span className="font-semibold text-slate-800">{rec.smokingStatus}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Alcohol</span>
                    <span className="font-semibold text-slate-800">{rec.alcoholConsumption}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lifestyle;
