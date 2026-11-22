import React from 'react';
import { Camera, User, Stethoscope, Shield } from 'lucide-react';

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
  '3xl': 'w-32 h-32 text-3xl',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
  '3xl': 'w-16 h-16',
};

const UserAvatar = ({
  user,
  photo,
  name,
  role,
  size = 'md',
  className = '',
  onEdit,
  showRoleBadge = false,
}) => {
  const effectivePhoto = photo || user?.profilePhoto;
  const effectiveName = name || user?.fullName || 'User';
  const effectiveRole = role || user?.role || 'ROLE_USER';

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const getRoleGradient = () => {
    if (effectiveRole === 'ROLE_NURSE') {
      return 'from-teal-600 to-cyan-700 text-white shadow-teal-700/20';
    }
    if (effectiveRole === 'ROLE_ADMIN') {
      return 'from-slate-700 to-indigo-800 text-white shadow-indigo-700/20';
    }
    return 'from-emerald-600 to-teal-700 text-white shadow-emerald-700/20';
  };

  const containerSize = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className={`${containerSize} rounded-full overflow-hidden flex items-center justify-center font-bold tracking-wider shadow-sm border-2 border-white ring-2 ring-slate-200/70 ${
          effectivePhoto ? 'bg-slate-100' : `bg-gradient-to-br ${getRoleGradient()}`
        } ${onEdit ? 'cursor-pointer group relative' : ''}`}
        onClick={onEdit}
      >
        {effectivePhoto ? (
          <img
            src={effectivePhoto}
            alt={effectiveName}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // fallback if invalid image URL
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(effectiveName)}</span>
        )}

        {/* Edit Hover Overlay if onEdit is present */}
        {onEdit && (
          <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Role Badge Indicator */}
      {showRoleBadge && (
        <span
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-700"
          title={
            effectiveRole === 'ROLE_NURSE'
              ? 'Health Worker (ANM)'
              : effectiveRole === 'ROLE_ADMIN'
              ? 'District Administrator'
              : 'Community Member'
          }
        >
          {effectiveRole === 'ROLE_NURSE' ? (
            <Stethoscope className="w-3 h-3 text-teal-600" />
          ) : effectiveRole === 'ROLE_ADMIN' ? (
            <Shield className="w-3 h-3 text-indigo-600" />
          ) : (
            <User className="w-3 h-3 text-emerald-600" />
          )}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
