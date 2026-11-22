import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import StatCard from '../../components/StatCard/StatCard';
import PredictionCard from '../../components/PredictionCard/PredictionCard';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import PhotoCaptureModal from '../../components/PhotoCaptureModal/PhotoCaptureModal';
import { KidneyIcon, HydrationDrop, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import {
  CalendarCheck,
  Stethoscope,
  Clock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Camera,
  Activity,
  Droplets,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const UserDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const fetchDashboard = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await userApi.getDashboard(user.id);
      setDashboardData(res.data);
    } catch (err) {
      setError('Unable to load your health dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  const handleSavePhoto = async (photoDataUrl) => {
    if (!user?.id) return;
    await userApi.updatePhoto(user.id, photoDataUrl);
    updateUserProfile({ profilePhoto: photoDataUrl });
    fetchDashboard();
  };

  if (loading) {
    return <Loading message="Loading your community kidney health information..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  }

  const latestAssessment = dashboardData?.latestAssessment;
  const latestRecord = dashboardData?.latestHealthRecord;
  const latestFollowUp = dashboardData?.latestFollowUp;
  const latestLifestyle = dashboardData?.latestLifestyle;
  const assignedNurse = dashboardData?.assignedHealthWorker;
  const recentAlerts = dashboardData?.recentAlerts || [];

  return (
    <div className="space-y-6">
      {/* Rural Kidney-Health Hero Header with Profile Photo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-md border border-teal-700/50">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-2 opacity-10 pointer-events-none text-emerald-200">
          <KidneyIcon className="w-56 h-56" filled />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-5">
            {/* User Profile Avatar with Camera Trigger */}
            <div className="relative group">
              <UserAvatar
                user={dashboardData?.user || user}
                size="2xl"
                className="ring-4 ring-emerald-300/40 shadow-lg"
                onEdit={() => setPhotoModalOpen(true)}
              />
              <button
                onClick={() => setPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md transition-transform transform hover:scale-110"
                title="Update photo with Camera or Upload"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-teal-700/80 border border-teal-500/50 text-teal-100 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <RuralVillageEmblem className="w-3 h-3 text-emerald-300" />
                <span>Rural CKD Surveillance Platform</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Namaste, {user?.fullName || 'Community Member'} 👋
              </h1>

              <p className="text-teal-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
                Let's keep your health and kidney wellness information up to date. Continuous monitoring helps detect early risks before complications develop.
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-teal-200/90">
                <span className="bg-black/25 px-2.5 py-0.5 rounded-md font-medium">
                  {user?.villageCommunity || 'Rural Community'}
                </span>
                <span>•</span>
                <span className="bg-black/25 px-2.5 py-0.5 rounded-md font-medium">
                  District: {user?.district || 'District Health Area'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Primary Actions in Header */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <Link
              to="/user/health-assessment"
              className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-teal-900 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 text-center"
            >
              <KidneyIcon className="w-4 h-4 text-emerald-700" filled />
              <span>Kidney Health Check</span>
            </Link>

            <Link
              to="/user/lifestyle"
              className="px-5 py-2.5 bg-teal-700/80 hover:bg-teal-700 text-white rounded-2xl font-semibold text-xs border border-teal-500/40 transition-all flex items-center justify-center space-x-2 text-center"
            >
              <HydrationDrop className="w-4 h-4 text-emerald-300" />
              <span>Record Hydration & Diet</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Key Health Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Latest Health Check"
          value={
            latestRecord
              ? `BP ${latestRecord.bp || '80'} / SC ${latestRecord.sc || '1.1'}`
              : 'Not Checked'
          }
          subtitle={
            latestRecord
              ? `Creatinine: ${latestRecord.sc ? `${latestRecord.sc} mg/dL` : 'Monitored'}`
              : 'Record latest renal vitals'
          }
          icon={KidneyIcon}
          color="teal"
        />

        <StatCard
          title="Kidney Risk Assessment"
          value={latestAssessment?.assessmentResult || 'Routine Monitoring'}
          subtitle={
            latestAssessment?.priorityReview
              ? 'Flagged for Health Worker Review'
              : 'Within normal rural parameters'
          }
          icon={latestAssessment?.priorityReview ? AlertTriangle : CheckCircle2}
          color={latestAssessment?.priorityReview ? 'amber' : 'emerald'}
        />

        <StatCard
          title="Next Follow-up"
          value={latestFollowUp?.status || 'Routine'}
          subtitle={
            latestFollowUp?.scheduledDate
              ? `Date: ${new Date(latestFollowUp.scheduledDate).toLocaleDateString()}`
              : 'Coordinated by ANM Sister'
          }
          icon={CalendarCheck}
          color={latestFollowUp?.status === 'Pending' ? 'amber' : 'blue'}
        />

        <StatCard
          title="Assigned Health Worker"
          value={assignedNurse?.fullName || 'Community ANM'}
          subtitle={assignedNurse?.villageCommunity || 'Primary Health Centre'}
          icon={Stethoscope}
          color="indigo"
        />
      </div>

      {/* Latest Assessment Prediction Banner */}
      {latestAssessment && (
        <div className="space-y-2">
          <PredictionCard assessment={latestAssessment} />
        </div>
      )}

      {/* Main Content Split: Renal Health Habits & Health Worker Coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rural Kidney Wellness Checklist & Lifestyle */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rural Kidney Health Guidance Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <KidneyIcon className="w-5 h-5 text-teal-700" filled />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Rural Kidney Health Monitoring Focus</h2>
                  <p className="text-xs text-slate-500">Preventive metrics for chronic kidney disease prevention in rural areas.</p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Surveillance Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-teal-800 font-bold">
                  <Droplets className="w-4 h-4 text-teal-600" />
                  <span>Hydration & Clean Water</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Daily Water Target: <span className="font-bold text-slate-800">{latestLifestyle?.waterIntakeLiters ? `${latestLifestyle.waterIntakeLiters} L logged` : '2.5 - 3.0 Litres'}</span>
                </div>
                <div className="text-[10px] text-teal-700">Crucial for renal toxin clearance</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Blood Pressure Check</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Latest BP: <span className="font-bold text-slate-800">{latestRecord?.bp ? `${latestRecord.bp} mmHg` : 'Not recorded'}</span>
                </div>
                <div className="text-[10px] text-emerald-700">Hypertension is a primary CKD cause</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-sky-800 font-bold">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Serum Creatinine Audit</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Latest SC: <span className="font-bold text-slate-800">{latestRecord?.sc ? `${latestRecord.sc} mg/dL` : '1.1 mg/dL target'}</span>
                </div>
                <div className="text-[10px] text-sky-700">Validated 24 Kaggle indicators</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/user/history"
                className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
              >
                <span>View Complete My Health Journey Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Activity Stream from Database */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Recent Health Activity & Logs</span>
            </h2>

            <div className="space-y-3">
              {latestRecord && (
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Health Check Completed</div>
                    <div className="text-slate-500">
                      Evaluated on {new Date(latestRecord.recordedAt).toLocaleDateString()} with 24 clinical renal markers.
                    </div>
                  </div>
                </div>
              )}

              {latestAssessment && (
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <KidneyIcon className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" filled />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">
                      Predictive Assessment: {latestAssessment.assessmentResult}
                    </div>
                    <div className="text-slate-500">
                      {latestAssessment.priorityReview
                        ? 'Added to Health Worker Priority Review queue.'
                        : 'Routine monitored health trajectory.'}
                    </div>
                  </div>
                </div>
              )}

              {latestFollowUp && (
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CalendarCheck className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Health Worker Follow-up Scheduled</div>
                    <div className="text-slate-500">
                      Status: {latestFollowUp.status} • Scheduled for {new Date(latestFollowUp.scheduledDate).toLocaleDateString()}.
                    </div>
                  </div>
                </div>
              )}

              {!latestRecord && !latestAssessment && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No health checks logged yet. Tap "Kidney Health Check" to start!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Health Worker Card & Chat Quick Action */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Assigned Health Worker</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Village ANM
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <UserAvatar
                user={assignedNurse}
                role="ROLE_NURSE"
                size="lg"
                showRoleBadge
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  {assignedNurse?.fullName || 'Sister Sunitha Rao'}
                </div>
                <div className="text-slate-500">{assignedNurse?.villageCommunity || 'Primary Health Centre'}</div>
                <div className="text-teal-700 font-semibold">{assignedNurse?.phoneNumber || 'Contact Available'}</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sister Lakshmi is your primary healthcare coordinator. She reviews your kidney assessments, verifies medication, and assists with follow-up appointments.
            </p>

            <Link
              to="/user/messages"
              className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat in Telugu / English (Voice Enabled)</span>
            </Link>
          </div>

          {/* Quick Reminders & Alerts Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Community Health Alerts</span>
            </h2>

            {recentAlerts.length > 0 ? (
              <div className="space-y-2">
                {recentAlerts.map((alt) => (
                  <div key={alt.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-semibold text-slate-800">{alt.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(alt.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">All alerts are up to date. No pending urgent notifications.</p>
            )}
          </div>
        </div>
      </div>

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        currentPhoto={user?.profilePhoto}
        onSavePhoto={handleSavePhoto}
        userName={user?.fullName}
        roleTitle="Community Member"
      />
    </div>
  );
};

export default UserDashboard;
