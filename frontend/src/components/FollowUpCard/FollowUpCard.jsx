import React from 'react';
import { CalendarCheck, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { KidneyIcon } from '../KidneyVisuals/KidneyVisuals';

const FollowUpCard = ({ followUp }) => {
  if (!followUp) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Follow-up Completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Follow-up Completed</span>;
      case 'Contacted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Contacted</span>;
      case 'Needs Further Review':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">Needs Further Review</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Pending Review</span>;
    }
  };

  const steps = [
    { title: 'Kidney Assessment', completed: true },
    { title: 'Health Worker Review', completed: followUp.status !== 'Pending' },
    { title: 'Contacted', completed: followUp.status === 'Contacted' || followUp.status === 'Follow-up Completed' },
    { title: 'Follow-up Completed', completed: followUp.status === 'Follow-up Completed' },
  ];

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3.5">
          <UserAvatar
            user={followUp.nurse}
            role="ROLE_NURSE"
            size="lg"
            showRoleBadge
          />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Rural Primary Care Coordination
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Follow-up with {followUp.nurse?.fullName || 'Assigned Health Worker'}
            </h3>
            <p className="text-xs text-slate-500">
              {followUp.nurse?.villageCommunity || 'Village Health Centre'}
            </p>
          </div>
        </div>
        <div>{getStatusBadge(followUp.status)}</div>
      </div>

      {/* Progress Timeline */}
      <div className="py-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
          Care Coordination Pipeline
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                step.completed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="text-[11px]">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Scheduled Checkup Date:</span>
          <span className="font-bold text-slate-800">
            {followUp.scheduledDate ? new Date(followUp.scheduledDate).toLocaleDateString() : 'To be scheduled'}
          </span>
        </div>
        {followUp.notes && (
          <div className="py-1 border-b border-slate-100">
            <span className="text-slate-500 block mb-0.5">Clinical Review Notes:</span>
            <span className="font-medium text-slate-800">{followUp.notes}</span>
          </div>
        )}
        {followUp.instructions && (
          <div className="py-1">
            <span className="text-slate-500 block mb-0.5">Renal Lifestyle & Dietary Instructions:</span>
            <span className="font-medium text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg block border border-teal-100">
              {followUp.instructions}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpCard;
