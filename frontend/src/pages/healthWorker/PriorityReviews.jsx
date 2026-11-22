import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthWorkerApi } from '../../api/healthWorkerApi';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { AlertTriangle, ChevronRight, Stethoscope, Clock, ShieldAlert, ArrowRight, MessageSquare } from 'lucide-react';

const PriorityReviews = () => {
  const [priorityList, setPriorityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPriorityList = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await healthWorkerApi.getPriorityList();
      setPriorityList(res.data || []);
    } catch (err) {
      setError('Unable to load priority reviews list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityList();
  }, []);

  if (loading) {
    return <Loading message="Loading rural kidney priority reviews..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPriorityList} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Priority Renal Reviews
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-200">
                {priorityList.length} Flagged
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Rural community members flagged with elevated kidney risk indicators requiring clinical ANM triage.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-xs font-semibold">
            <RuralVillageEmblem className="w-3.5 h-3.5 text-teal-700" />
            <span>Big Data CKD Surveillance</span>
          </span>
        </div>
      </div>

      {/* Main Table with Photo Avatars & Renal Biomarkers */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-4 px-4 sm:px-6">Community Member</th>
                <th className="py-4 px-4 sm:px-6">Renal Biomarkers</th>
                <th className="py-4 px-4 sm:px-6">Assessment Result</th>
                <th className="py-4 px-4 sm:px-6">Follow-up Status</th>
                <th className="py-4 px-4 sm:px-6 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {priorityList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <KidneyIcon className="w-10 h-10 mx-auto text-emerald-400 mb-2" filled />
                    <p className="font-semibold text-slate-700">No Priority Reviews Pending</p>
                    <p className="text-xs text-slate-400">All community members currently have stable kidney health indicators.</p>
                  </td>
                </tr>
              ) : (
                priorityList.map((item, idx) => {
                  const person = item.user;
                  const pred = item.prediction;
                  const hr = item.healthRecord;
                  const fu = item.latestFollowUp;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <UserAvatar
                            user={person}
                            role="ROLE_USER"
                            size="md"
                            className="ring-2 ring-amber-300"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {person?.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                              <span>{person?.villageCommunity}</span>
                              {person?.age && (
                                <>
                                  <span>•</span>
                                  <span>{person.age} yrs</span>
                                </>
                              )}
                              {person?.gender && (
                                <>
                                  <span>•</span>
                                  <span>{person.gender}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-0.5 text-xs">
                          {hr ? (
                            <>
                              <div className="font-semibold text-slate-800">
                                SC: <span className="text-amber-800 font-bold">{hr.sc ?? 'N/A'} mg/dL</span> • BP: <span className="text-slate-900 font-bold">{hr.bp ?? 'N/A'} mmHg</span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Albumin: {hr.al ?? '0'} • Glucose: {hr.bgr ?? 'N/A'} mg/dL
                              </div>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs">Record on file</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <KidneyIcon className="w-3 h-3 text-amber-700" filled />
                          <span>{pred?.assessmentResult || 'Increased Risk'}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {pred?.predictionDate ? new Date(pred.predictionDate).toLocaleDateString() : 'Recent'}
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-slate-800">{fu ? fu.status : 'Pending Review'}</div>
                        {fu?.scheduledDate && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Target: {new Date(fu.scheduledDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <Link
                          to={`/nurse/members/${person?.id}`}
                          className="inline-flex items-center space-x-1 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                        >
                          <span>Review Case</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriorityReviews;
