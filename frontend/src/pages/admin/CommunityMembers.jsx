import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { Users, UserCheck, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';

const CommunityMembers = () => {
  const [users, setUsers] = useState([]);
  const [healthWorkers, setHealthWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedNurseId, setSelectedNurseId] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [userRes, nurseRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getHealthWorkers(),
      ]);
      setUsers(userRes.data || []);
      setHealthWorkers(nurseRes.data || []);
    } catch (err) {
      setError('Unable to load community members and health workers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignNurse = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedNurseId) return;

    try {
      await adminApi.assignHealthWorker(selectedUser.id, selectedNurseId);
      setAssignSuccess(`Health worker reassigned successfully for ${selectedUser.fullName}`);
      setSelectedUser(null);
      setSelectedNurseId('');
      fetchData();
    } catch (err) {
      alert('Unable to assign health worker.');
    }
  };

  if (loading) {
    return <Loading message="Loading community members records..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-100">
              <RuralVillageEmblem className="w-3.5 h-3.5" />
              <span>Big Data Rural Health Surveillance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Community Members Roster</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
              Directory of all registered rural residents across villages with designated health worker care coverage.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-2xl text-xs font-bold text-white border border-white/20">
              {users.length} Registered Members
            </span>
          </div>
        </div>
      </div>

      {assignSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{assignSuccess}</span>
        </div>
      )}

      {/* Modal / Dialog for Reassigning Nurse */}
      {selectedUser && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3">
            <UserAvatar user={selectedUser} size="md" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Assign / Reassign Health Worker for <span className="text-teal-800">{selectedUser.fullName}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {selectedUser.villageCommunity}, {selectedUser.district}
              </p>
            </div>
          </div>
          <form onSubmit={handleAssignNurse} className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedNurseId}
              onChange={(e) => setSelectedNurseId(e.target.value)}
              required
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            >
              <option value="">Select Health Worker...</option>
              {healthWorkers.map((hw) => (
                <option key={hw.id} value={hw.id}>
                  {hw.fullName} ({hw.villageCommunity})
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Confirm Assignment
            </button>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Community Member</th>
                <th className="py-3.5 px-4 sm:px-6">Village & District</th>
                <th className="py-3.5 px-4 sm:px-6">Contact Phone</th>
                <th className="py-3.5 px-4 sm:px-6">Assigned Health Worker</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No community members registered yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={u} size="md" />
                        <div>
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-xs text-slate-400">
                            {u.age ? `${u.age} yrs` : ''} • {u.gender || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{u.villageCommunity || 'Rural Community'}</span>
                      </div>
                      <div className="text-slate-400">{u.district || 'District'}</div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-xs font-medium text-slate-600">
                      {u.phoneNumber || '—'}
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      {u.assignedNurse ? (
                        <div className="flex items-center space-x-2">
                          <UserAvatar user={u.assignedNurse} size="sm" />
                          <div>
                            <div className="font-semibold text-teal-900 text-xs">{u.assignedNurse.fullName}</div>
                            <div className="text-[10px] text-slate-400">{u.assignedNurse.villageCommunity}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setSelectedNurseId(u.assignedNurse?.id || '');
                        }}
                        className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 transition-colors"
                      >
                        Reassign
                      </button>
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

export default CommunityMembers;
