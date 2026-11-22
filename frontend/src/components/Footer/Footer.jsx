import React from 'react';
import { ShieldAlert, HeartPulse } from 'lucide-react';
import { KidneyIcon, RuralVillageEmblem } from '../KidneyVisuals/KidneyVisuals';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
            <KidneyIcon className="w-4 h-4 text-teal-700" filled />
            <span>ArogyaTrack</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="text-teal-800 font-semibold text-xs">
            Track Health. Connect Care. Stay Well.
          </div>
          <span className="text-slate-300">•</span>
          <div className="inline-flex items-center space-x-1 text-slate-600 font-medium text-xs">
            <RuralVillageEmblem className="w-3.5 h-3.5 text-teal-600" />
            <span>Big Data–Driven Rural Health Risk Monitoring System</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-1.5 text-slate-400 max-w-2xl mx-auto pt-1 text-[11px] leading-relaxed">
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
          <span>
            Assistive Clinical Decision-Support & Rural Kidney Disease (CKD) Surveillance System. Not a substitute for certified medical diagnosis, laboratory pathology, or prescription.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
