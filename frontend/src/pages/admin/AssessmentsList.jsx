import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { ClipboardList, Search, Filter, AlertTriangle, CheckCircle, Eye, Calendar, Sparkles, Activity } from 'lucide-react';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getAssessments();
      setAssessments(res.data || []);
    } catch (err) {
      setError('Unable to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filtered = assessments.filter((item) => {
    const userName = item.user?.fullName?.toLowerCase() || '';
    const userEmail = item.user?.email?.toLowerCase() || '';
    const matchesSearch = userName.includes(searchTerm.toLowerCase()) || userEmail.includes(searchTerm.toLowerCase());
    
    if (riskFilter === 'PRIORITY') {
      return matchesSearch && item.priorityReview;
    }
    if (riskFilter === 'STANDARD') {
      return matchesSearch && !item.priorityReview;
    }
    return matchesSearch;
  });

  if (loading) {
    return <Loading message="Loading community health assessments..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAssessments} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
              <RuralVillageEmblem className="w-3.5 h-3.5" />
              <span>Big Data Rural CKD Surveillance Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Community Health Assessments</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
              Auditable records of all predictive kidney health assessments performed across rural health sub-centres.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-bold px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-2xl text-white border border-white/20">
              {assessments.length} Total Assessments
            </span>
            <span className="text-xs font-bold px-3 py-1.5 bg-amber-400/20 backdrop-blur-md text-amber-200 border border-amber-300/30 rounded-2xl">
              {assessments.filter((a) => a.priorityReview).length} Priority
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Risk Categories</option>
            <option value="PRIORITY">Priority Review Required</option>
            <option value="STANDARD">Standard Monitored Range</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Community Member</th>
                <th className="py-3.5 px-4 sm:px-6">Assessment Date</th>
                <th className="py-3.5 px-4 sm:px-6">ML Model</th>
                <th className="py-3.5 px-4 sm:px-6">Risk Indication</th>
                <th className="py-3.5 px-4 sm:px-6">Probability Score</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No assessments match the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isPriority = item.priorityReview;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <UserAvatar user={item.user} size="md" />
                          <div>
                            <div className="font-bold text-slate-900">{item.user?.fullName || 'Community Member'}</div>
                            <div className="text-xs text-slate-400">{item.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-slate-600">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.predictionDate ? new Date(item.predictionDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800">
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          <span>{item.modelName || 'Random Forest'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        {isPriority ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <KidneyIcon className="w-3.5 h-3.5 text-amber-700" filled />
                            <span>Priority Review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-700" />
                            <span>Standard</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-800">
                        {item.predictionProbability != null
                          ? `${(item.predictionProbability * 100).toFixed(1)}%`
                          : 'Available'}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setSelectedAssessment(item)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-teal-200 text-xs font-bold text-teal-800 hover:text-teal-900 hover:bg-teal-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Assessment Inspection</h3>
                <p className="text-xs text-slate-500">ID #{selectedAssessment.id} • Model: {selectedAssessment.modelName}</p>
              </div>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Community Member:</span>
                <span className="font-semibold text-slate-800">{selectedAssessment.user?.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-800">{selectedAssessment.user?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Assessment Date:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAssessment.predictionDate ? new Date(selectedAssessment.predictionDate).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Predicted Assessment Class:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAssessment.prediction === 'ckd' || selectedAssessment.prediction === '1' ? 'Increased Risk Identified' : 'Normal / Low Risk'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Assigned Priority Status:</span>
                <span className={`font-semibold ${selectedAssessment.priorityReview ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {selectedAssessment.priorityReview ? 'Priority Review List' : 'Standard Follow-up'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Model Probability Score:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAssessment.predictionProbability != null
                    ? `${(selectedAssessment.predictionProbability * 100).toFixed(2)}%`
                    : 'Not recorded'}
                </span>
              </div>
              {selectedAssessment.healthRecord && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mt-2 space-y-1">
                  <div className="text-xs font-semibold text-slate-700 mb-1">Key Parameters at Submission:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Age: <span className="font-medium text-slate-800">{selectedAssessment.healthRecord.age ?? 'N/A'}</span></div>
                    <div>BP: <span className="font-medium text-slate-800">{selectedAssessment.healthRecord.bloodPressure ?? 'N/A'} mmHg</span></div>
                    <div>Blood Glucose: <span className="font-medium text-slate-800">{selectedAssessment.healthRecord.bloodGlucoseRandom ?? 'N/A'} mg/dL</span></div>
                    <div>Serum Creatinine: <span className="font-medium text-slate-800">{selectedAssessment.healthRecord.serumCreatinine ?? 'N/A'} mg/dL</span></div>
                    <div>Blood Urea: <span className="font-medium text-slate-800">{selectedAssessment.healthRecord.bloodUrea ?? 'N/A'} mg/dL</span></div>
                    <div>Hemoglobin: <span className="font-medium text-slate-800">{selectedAssessment.healthRecord.hemoglobin ?? 'N/A'} g/dL</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsList;
