import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { Stethoscope, Phone, Mail, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

const HealthWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getHealthWorkers();
      setWorkers(res.data || []);
    } catch (err) {
      setError('Unable to load health workers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  if (loading) {
    return <Loading message="Loading health workers workload and details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchWorkers} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
              <RuralVillageEmblem className="w-3.5 h-3.5" />
              <span>Accredited Village Health Force</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Rural Health Workers & ANMs</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
              ANM sisters, ASHA supervisors, and community health officers conducting field-level kidney risk assessments and follow-ups.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-2xl text-xs font-bold text-white border border-white/20">
              {workers.length} Active Staff
            </span>
          </div>
        </div>
      </div>

      {/* Health Workers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Health Worker</th>
                <th className="py-3.5 px-4 sm:px-6">Assigned Health Centre / Village</th>
                <th className="py-3.5 px-4 sm:px-6">Contact & Phone</th>
                <th className="py-3.5 px-4 sm:px-6">District Jurisdiction</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Field Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {workers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No health workers registered.
                  </td>
                </tr>
              ) : (
                workers.map((hw) => (
                  <tr key={hw.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={hw} size="md" />
                        <div>
                          <div className="font-bold text-slate-900">{hw.fullName}</div>
                          <div className="text-xs text-slate-400">{hw.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{hw.villageCommunity}</span>
                      </div>
                      <div className="text-[11px] text-teal-700">Primary Health Sub-Centre</div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs font-medium text-slate-600">
                      <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>{hw.phoneNumber}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs font-semibold text-slate-700">
                      {hw.district}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Active in Field</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthWorkers;
