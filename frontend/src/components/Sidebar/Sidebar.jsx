import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar/UserAvatar';
import PhotoCaptureModal from '../PhotoCaptureModal/PhotoCaptureModal';
import { KidneyIcon, HydrationDrop, RuralVillageEmblem } from '../KidneyVisuals/KidneyVisuals';
import { userApi } from '../../api/userApi';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Bell,
  User,
  LogOut,
  AlertTriangle,
  Users,
  Stethoscope,
  BarChart3,
  TrendingUp,
  X,
  Camera,
  HeartHandshake,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const handleSavePhoto = async (photoDataUrl) => {
    if (!user?.id) return;
    await userApi.updatePhoto(user.id, photoDataUrl);
    updateUserProfile({ profilePhoto: photoDataUrl });
  };

  const canHavePhoto = role === 'ROLE_USER' || role === 'ROLE_NURSE';

  const getUserNavSections = () => [
    {
      heading: 'Renal Health Monitoring',
      items: [
        { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
        { name: 'Kidney Health Check', path: '/user/health-assessment', icon: KidneyIcon },
        { name: 'Lifestyle & Hydration', path: '/user/lifestyle', icon: HydrationDrop },
        { name: 'My Health Journey', path: '/user/history', icon: TrendingUp },
      ],
    },
    {
      heading: 'Community Care & Contact',
      items: [
        { name: 'Follow-up Schedule', path: '/user/follow-ups', icon: CalendarCheck },
        { name: 'Messages with ANM', path: '/user/messages', icon: MessageSquare },
        { name: 'Health Alerts', path: '/user/notifications', icon: Bell },
        { name: 'My Profile', path: '/user/profile', icon: User },
      ],
    },
  ];

  const getNurseNavSections = () => [
    {
      heading: 'Clinical Triage & Reviews',
      items: [
        { name: 'Nurse Command Center', path: '/nurse/dashboard', icon: LayoutDashboard },
        { name: 'Priority Renal Reviews', path: '/nurse/priority-list', icon: AlertTriangle },
        { name: 'Monitored Community', path: '/nurse/members', icon: Users },
      ],
    },
    {
      heading: 'Follow-up & Coordination',
      items: [
        { name: 'Follow-up Manager', path: '/nurse/follow-ups', icon: CalendarCheck },
        { name: 'Telugu / English Chat', path: '/nurse/messages', icon: MessageSquare },
        { name: 'System Alerts', path: '/nurse/notifications', icon: Bell },
        { name: 'Nurse Profile', path: '/user/profile', icon: User },
      ],
    },
  ];

  const getAdminNavSections = () => [
    {
      heading: 'District Surveillance',
      items: [
        { name: 'District Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Community Roster', path: '/admin/users', icon: Users },
        { name: 'Health Worker Staff', path: '/admin/nurses', icon: Stethoscope },
      ],
    },
    {
      heading: 'Big Data & ML Analytics',
      items: [
        { name: 'All Assessments Audit', path: '/admin/assessments', icon: KidneyIcon },
        { name: 'ML Model Statistics', path: '/admin/statistics', icon: BarChart3 },
        { name: 'Population CKD Trends', path: '/admin/trends', icon: TrendingUp },
      ],
    },
  ];

  let navSections = [];
  if (role === 'ROLE_NURSE') navSections = getNurseNavSections();
  else if (role === 'ROLE_ADMIN') navSections = getAdminNavSections();
  else navSections = getUserNavSections();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 md:z-0 w-64 bg-white border-r border-slate-200/90 flex flex-col h-full flex-shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 md:hidden bg-teal-900 text-white">
          <div className="flex items-center space-x-2">
            <KidneyIcon className="w-5 h-5 text-emerald-300" />
            <span className="font-bold text-sm">ArogyaTrack Portal</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white rounded-lg focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Header Badge */}
        <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 text-teal-900">
          <div className="flex items-center space-x-2">
            <RuralVillageEmblem className="w-4 h-4 text-teal-700 shrink-0" />
            <div className="text-[11px] font-bold tracking-tight uppercase">
              Rural CKD Surveillance
            </div>
          </div>
          <p className="text-[10px] text-teal-700/80 mt-0.5 leading-snug">
            Big Data–Driven Health Risk Monitoring
          </p>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {sec.heading}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile Card at Bottom of Sidebar */}
        {user && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="relative">
                  <UserAvatar user={user} size="sm" />
                  {canHavePhoto && (
                    <button
                      onClick={() => setPhotoModalOpen(true)}
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full flex items-center justify-center shadow-xs"
                      title="Update photo"
                    >
                      <Camera className="w-2 h-2" />
                    </button>
                  )}
                </div>
                <div className="overflow-hidden text-left">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium truncate">
                    {role === 'ROLE_NURSE'
                      ? 'Health Worker (ANM)'
                      : role === 'ROLE_ADMIN'
                      ? 'District Admin'
                      : 'Community Member'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Photo Modal */}
      {canHavePhoto && (
        <PhotoCaptureModal
          isOpen={photoModalOpen}
          onClose={() => setPhotoModalOpen(false)}
          currentPhoto={user?.profilePhoto}
          onSavePhoto={handleSavePhoto}
          userName={user?.fullName}
          roleTitle={role === 'ROLE_NURSE' ? 'Health Worker' : 'Community Member'}
        />
      )}
    </>
  );
};

export default Sidebar;
