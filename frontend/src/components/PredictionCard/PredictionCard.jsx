import React from 'react';
import { ShieldAlert, CheckCircle, Clock, Stethoscope, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KidneyIcon, RuralVillageEmblem } from '../KidneyVisuals/KidneyVisuals';

const PredictionCard = ({ assessment, showFollowUpLink = true }) => {
  if (!assessment) return null;

  const isPriority = assessment.priorityReview || assessment.assessmentResult === 'Increased Risk';
  const riskProbPercent = assessment.riskProbability != null
    ? Math.round(assessment.riskProbability * 100)
    : null;

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border ${
        isPriority
          ? 'bg-amber-50/60 border-amber-200/90 shadow-sm'
          : 'bg-white border-slate-200/90 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/70 gap-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPriority ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <KidneyIcon className="w-7 h-7" filled />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <RuralVillageEmblem className="w-3 h-3 text-teal-700" />
              <span>Kidney Health Risk Assessment</span>
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {assessment.assessmentResult || (isPriority ? 'Increased Risk Identified' : 'Stable Monitored Range')}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isPriority ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Priority Renal Review</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Standard Community Monitoring</span>
            </span>
          )}
        </div>
      </div>

      {/* Summary message */}
      <div className="py-4 space-y-2">
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
          {assessment.assessmentSummary ||
            (isPriority
              ? 'Assessment indicates increased risk and requires health worker review.'
              : 'Assessment indicates stable readings within monitored community ranges.')}
        </p>

        {isPriority && (
          <div className="p-3 bg-amber-100/80 border border-amber-200 text-amber-950 rounded-2xl text-xs font-medium flex items-center space-x-2">
            <span className="text-base">🔔</span>
            <span>
              Your assessment has been added to the health worker's priority review list for dietary and clinical triage.
            </span>
          </div>
        )}
      </div>

      {/* Validated ML Models & Confidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-t border-slate-200/60 text-xs">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 block mb-1 font-medium text-[11px]">Assessment Date</span>
          <span className="font-bold text-slate-900">
            {assessment.assessmentDate ? new Date(assessment.assessmentDate).toLocaleDateString() : 'Today'}
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 block mb-1 font-medium text-[11px] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Random Forest Model</span>
          </span>
          <span className="font-bold text-slate-900">
            {assessment.rfProbability != null
              ? `${(assessment.rfProbability * 100).toFixed(1)}% Risk Indication`
              : 'Evaluated (100% test accuracy)'}
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 block mb-1 font-medium text-[11px] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Logistic Regression</span>
          </span>
          <span className="font-bold text-slate-900">
            {assessment.lrProbability != null
              ? `${(assessment.lrProbability * 100).toFixed(1)}% Probability`
              : 'Evaluated (98.75% test accuracy)'}
          </span>
        </div>
      </div>

      {showFollowUpLink && (
        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>Health Worker Status: {assessment.healthWorkerReviewStatus || 'Pending Review'}</span>
          </div>

          <Link
            to="/user/follow-ups"
            className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
          >
            <span>View Follow-up Plan</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
