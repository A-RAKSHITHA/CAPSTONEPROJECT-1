import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import PhotoCaptureModal from '../../components/PhotoCaptureModal/PhotoCaptureModal';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2, Camera, Upload, RefreshCw } from 'lucide-react';

const UserProfile = () => {
  const { user, role, updateUserProfile } = useAuth();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    villageCommunity: user?.villageCommunity || '',
    district: user?.district || '',
    age: user?.age || '',
    gender: user?.gender || 'Male',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canHavePhoto = role === 'ROLE_USER' || role === 'ROLE_NURSE';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePhoto = async (photoDataUrl) => {
    if (!user?.id) return;
    try {
      await userApi.updatePhoto(user.id, photoDataUrl);
      updateUserProfile({ profilePhoto: photoDataUrl });
      setSuccess('Profile photo updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Failed to update profile photo. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await userApi.updateProfile(user.id, {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null,
      });
      updateUserProfile(res.data);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Unable to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero Header with Profile Photo & Verification Badge */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-36 h-36 bg-teal-500/5 rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left relative z-10">
          {/* Avatar with Camera Trigger */}
          <div className="relative group">
            <UserAvatar
              user={user}
              size="2xl"
              className="ring-4 ring-emerald-100 shadow-md"
              onEdit={canHavePhoto ? () => setPhotoModalOpen(true) : undefined}
            />
            {canHavePhoto && (
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-teal-800 hover:bg-teal-900 text-white rounded-full shadow-md transition-transform transform hover:scale-110"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.fullName}
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  {role === 'ROLE_NURSE'
                    ? 'Accredited Health Worker (ANM)'
                    : role === 'ROLE_ADMIN'
                    ? 'District Health Administrator'
                    : 'Community Member'} • {user?.email}
                </p>
              </div>

              <div className="inline-flex items-center space-x-1 self-center sm:self-start px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Verified Account</span>
              </div>
            </div>

            {/* Profile Photo Action Buttons for Community Member and Nurse */}
            {canHavePhoto && (
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Photo with Camera</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Demographic & Community Information</h2>
            <p className="text-xs text-slate-500">
              Rural survey details used to connect you with village health workers and primary health centres.
            </p>
          </div>
          <RuralVillageEmblem className="w-5 h-5 text-teal-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Village / Community Area
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="villageCommunity"
                  value={formData.villageCommunity}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 48"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>

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
    </div>
  );
};

export default UserProfile;
