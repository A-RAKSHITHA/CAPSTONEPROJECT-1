import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { healthApi } from '../../api/healthApi';
import HealthForm from '../../components/HealthForm/HealthForm';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { ShieldCheck, AlertCircle, Info, Sparkles } from 'lucide-react';

const HealthAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastData, setLastData] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setLastData(formData);

    try {
      const payload = {
        ...formData,
        userId: user?.id,
      };

      const response = await healthApi.submitHealthRecord(payload);
      // Navigate to assessment result page with latest prediction data
      navigate('/user/assessment-result', { state: { assessment: response.data } });
    } catch (err) {
      console.error('Failed to submit health assessment:', err);
      const msg = err.response?.data?.message || 'Unable to connect to the assessment service. Please verify your connection or click Retry.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header with Distinctive Rural Kidney Health Surveillance Theme */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-teal-500/5 rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <KidneyIcon className="w-7 h-7 text-teal-700" filled />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Kidney Health Assessment
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Rural CKD Survey
                </span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Record your latest health vitals and clinical lab measurements for automated machine learning risk evaluation.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-1 self-start sm:self-center px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold">
            <RuralVillageEmblem className="w-3.5 h-3.5 text-teal-700" />
            <span>24 Kaggle Renal Biomarkers</span>
          </div>
        </div>

        {/* Informative Guidance Banner */}
        <div className="mt-5 p-4 bg-gradient-to-r from-teal-50/70 to-emerald-50/70 rounded-2xl border border-teal-100/90 text-xs text-teal-950 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold">Big Data–Driven Rural Health Risk Monitoring System: </span>
            This assessment submits 24 validated clinical indicators (Blood Pressure, Blood Glucose, Serum Creatinine, Blood Urea, Urine Albumin, etc.) to trained Logistic Regression and Random Forest models to assist village health workers with early triage and routine follow-up.
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center space-x-3 text-teal-900 text-sm animate-pulse">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0 animate-spin" />
          <div>
            <p className="font-bold">Evaluating 24 Renal Biomarkers with Dual-Model Machine Learning...</p>
            <p className="text-xs text-teal-700">Running consensus inference through trained Random Forest and Logistic Regression models.</p>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={lastData ? () => handleSubmit(lastData) : null} />}

      {/* 24-Feature Validated Clinical Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <HealthForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default HealthAssessment;
