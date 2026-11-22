import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KidneyIcon, RuralVillageEmblem } from '../KidneyVisuals/KidneyVisuals';
import UserAvatar from '../UserAvatar/UserAvatar';
import PhotoCaptureModal from '../PhotoCaptureModal/PhotoCaptureModal';
import { userApi } from '../../api/userApi';
import { Bell, LogOut, Menu, Camera } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSavePhoto = async (photoDataUrl) => {
    if (!user?.id) return;
    await userApi.updatePhoto(user.id, photoDataUrl);
    updateUserProfile({ profilePhoto: photoDataUrl });
  };

  const getRoleBadge = () => {
    if (role === 'ROLE_NURSE') {
      return (
        <span className="inline-flex items-center space-x-1 bg-teal-100 text-teal-900 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
          <span>Health Worker (ANM)</span>
        </span>
      );
    }
    if (role === 'ROLE_ADMIN') {
      return (
        <span className="inline-flex items-center space-x-1 bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
          <span>District Administrator</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
        <span>Community Member</span>
      </span>
    );
  };

  const getNotificationLink = () => {
    if (role === 'ROLE_NURSE') return '/nurse/notifications';
    if (role === 'ROLE_ADMIN') return '/admin/dashboard';
    return '/user/notifications';
  };

  const canHavePhoto = role === 'ROLE_USER' || role === 'ROLE_NURSE';

  return (
    <>
      <header className="h-16 flex-shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Brand & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-md shadow-teal-900/15 group-hover:scale-105 transition-transform">
                <KidneyIcon className="w-6 h-6 text-emerald-200" filled />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    ArogyaTrack
                  </span>
                  <span className="hidden xl:inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    <RuralVillageEmblem className="w-2.5 h-2.5 text-teal-700" />
                    <span>Rural CKD Surveillance</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                  Track Health. Connect Care. Stay Well.
                </p>
              </div>
            </Link>
          </div>

          {/* Right User Bar */}
          {user && (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden lg:block">{getRoleBadge()}</div>

              {/* Alerts Bell */}
              <Link
                to={getNotificationLink()}
                className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors relative"
                title="Alerts & Reminders"
              >
                <Bell className="w-5 h-5" />
              </Link>

              {/* User Avatar with Photo Support */}
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                <div className="relative group">
                  <UserAvatar
                    user={user}
                    size="sm"
                    className="border border-teal-500/30"
                  />
                  {canHavePhoto && (
                    <button
                      onClick={() => setPhotoModalOpen(true)}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-800 text-white rounded-full flex items-center justify-center hover:bg-teal-900 shadow-sm"
                      title="Update profile photo (Camera or Upload)"
                    >
                      <Camera className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                <div className="hidden md:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-900 flex items-center space-x-1">
                    <span>{user.fullName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    {user.villageCommunity || user.district || user.email}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

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

export default Navbar;
