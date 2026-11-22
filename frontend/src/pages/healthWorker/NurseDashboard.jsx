import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { healthWorkerApi } from '../../api/healthWorkerApi';
import StatCard from '../../components/StatCard/StatCard';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import PhotoCaptureModal from '../../components/PhotoCaptureModal/PhotoCaptureModal';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { userApi } from '../../api/userApi';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import {
  Users,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  Stethoscope,
  Camera,
  ShieldAlert,
  Activity,
  HeartHandshake
} from 'lucide-react';

const NurseDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await healthWorkerApi.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      setError('Unable to load health worker dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSavePhoto = async (photoDataUrl) => {
    if (!user?.id) return;
    await userApi.updatePhoto(user.id, photoDataUrl);
    updateUserProfile({ profilePhoto: photoDataUrl });
    fetchStats();
  };

  if (loading) {
    return <Loading message="Loading rural kidney health monitoring dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStats} />;
  }

  const priorityReviews = stats?.priorityReviews || [];

  return (
    <div className="space-y-6">
      {/* Rural Health Worker Command Hero Header with Photo Avatar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-md border border-teal-700/50">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-2 opacity-10 pointer-events-none text-emerald-200">
          <KidneyIcon className="w-52 h-52" filled />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-5">
            {/* Health Worker Profile Avatar with Camera Trigger */}
            <div className="relative group">
              <UserAvatar
                user={user}
                role="ROLE_NURSE"
                size="2xl"
                className="ring-4 ring-teal-300/40 shadow-lg"
                onEdit={() => setPhotoModalOpen(true)}
              />
              <button
                onClick={() => setPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-md transition-transform transform hover:scale-110"
                title="Update photo with Camera or Upload"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-teal-700/80 border border-teal-500/50 text-teal-100 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <RuralVillageEmblem className="w-3 h-3 text-emerald-300" />
                <span>Rural PHC Care Coordinator</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Namaste, Sister {user?.fullName || 'Health Worker'} 👋
              </h1>

              <p className="text-teal-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
                Rural Kidney Health & Community Triage Center. Assistive Big Data predictions prioritize members with elevated creatinine and renal risk factors for clinical follow-up.
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-teal-200/90">
                <span className="bg-black/25 px-2.5 py-0.5 rounded-md font-medium">
                  {user?.villageCommunity || 'Chilakaluripet Health Centre'}
                </span>
                <span>•</span>
                <span className="bg-black/25 px-2.5 py-0.5 rounded-md font-medium">
                  District: {user?.district || 'Guntur'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <Link
              to="/nurse/priority-list"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 text-center"
            >
              <AlertTriangle className="w-4 h-4 text-amber-900" />
              <span>Priority Reviews ({stats?.priorityReviewsCount || 0})</span>
            </Link>

            <Link
              to="/nurse/messages"
              className="px-5 py-2.5 bg-teal-700/80 hover:bg-teal-700 text-white rounded-2xl font-semibold text-xs border border-teal-500/40 transition-all flex items-center justify-center space-x-2 text-center"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Bilingual Telugu Messages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Clinical Workload Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Community Members"
          value={stats?.assignedMembersCount || 0}
          subtitle="Monitored in village mandal"
          icon={Users}
          color="teal"
        />

        <StatCard
          title="Priority Renal Reviews"
          value={stats?.priorityReviewsCount || 0}
          subtitle="Elevated CKD risk markers flagged"
          icon={AlertTriangle}
          color="amber"
        />

        <StatCard
          title="Pending Follow-ups"
          value={stats?.pendingFollowUpsCount || 0}
          subtitle="Awaiting clinical contact / review"
          icon={CalendarCheck}
          color="blue"
        />

        <StatCard
          title="Completed Follow-ups"
          value={stats?.completedFollowUpsCount || 0}
          subtitle="Care plans & diet advised"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Priority Renal Review Queue Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Priority Renal Review Queue</h2>
              <p className="text-xs text-slate-500">
                Community members requiring urgent health worker triage based on validated ML renal models.
              </p>
            </div>
          </div>

          <Link
            to="/nurse/priority-list"
            className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
          >
            <span>View All ({stats?.priorityReviewsCount || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {priorityReviews.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">Priority Queue Clear</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              All assigned community members currently have normal or stable monitored indicators.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {priorityReviews.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-2xl transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <UserAvatar
                    user={item.user}
                    role="ROLE_USER"
                    size="md"
                    className="ring-2 ring-amber-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.user?.fullName || 'Community Member'}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                      <span>{item.user?.villageCommunity || 'Village'}</span>
                      <span>•</span>
                      <span>{item.user?.phoneNumber || 'No phone'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    <KidneyIcon className="w-3 h-3 text-amber-700" filled />
                    <span>Renal Priority Review</span>
                  </span>

                  <Link
                    to={`/nurse/members/${item.user?.id}`}
                    className="p-2 text-teal-800 hover:bg-teal-50 rounded-xl transition-colors"
                    title="Open Member Profile"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Coordination & Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monitored Villages Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <RuralVillageEmblem className="w-4 h-4 text-teal-700" />
              <span>Village Kidney Health Surveillance</span>
            </h2>
            <Link to="/nurse/members" className="text-xs font-bold text-teal-800 hover:underline">
              Manage Community
            </Link>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            As village ANM, you are the first responder for early chronic kidney risk detection. Regular checks on blood pressure and serum creatinine prevent irreversible kidney damage in agricultural and rural populations.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/nurse/follow-ups"
              className="p-3 bg-slate-50 hover:bg-teal-50 rounded-2xl border border-slate-200 text-slate-700 hover:text-teal-900 font-semibold transition-colors flex items-center space-x-2"
            >
              <CalendarCheck className="w-4 h-4 text-teal-700" />
              <span>Follow-up Manager</span>
            </Link>

            <Link
              to="/nurse/messages"
              className="p-3 bg-slate-50 hover:bg-teal-50 rounded-2xl border border-slate-200 text-slate-700 hover:text-teal-900 font-semibold transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 text-teal-700" />
              <span>Telugu / Voice Dictation</span>
            </Link>
          </div>
        </div>

        {/* Clinical Safety Protocol Notice */}
        <div className="bg-gradient-to-br from-teal-50/60 to-emerald-50/60 p-6 rounded-3xl border border-teal-100 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-teal-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-teal-700" />
            <span>Health Worker Decision-Support Notice</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Machine learning outputs provide prioritized clinical triage and risk classification based on the 24 Kaggle dataset features. They do not constitute an autonomous medical diagnosis. Refer critical cases to the District Hospital or Primary Health Centre nephrologist for confirmatory urinalysis and ultrasound.
          </p>
        </div>
      </div>

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        currentPhoto={user?.profilePhoto}
        onSavePhoto={handleSavePhoto}
        userName={user?.fullName}
        roleTitle="Health Worker (ANM)"
      />
    </div>
  );
};

export default NurseDashboard;
