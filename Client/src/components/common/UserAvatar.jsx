import React from 'react';
import { getUserInitials, getUserDisplayName, getUserAvatarColor } from '../../utils/userUtils';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  showName = false, 
  showUsername = false,
  className = '',
  onClick = null,
  hoverEffect = false,
  colorVariant = 'gradient' // 'gradient', 'solid', 'consistent'
}) => {
  if (!user) {
    return null;
  }

  // Size configurations
  const sizeConfig = {
    xs: { 
      avatar: 'w-6 h-6 text-xs',
      text: 'text-xs',
      spacing: 'space-x-1'
    },
    sm: { 
      avatar: 'w-8 h-8 text-sm',
      text: 'text-sm',
      spacing: 'space-x-2'
    },
    md: { 
      avatar: 'w-12 h-12 text-base',
      text: 'text-base',
      spacing: 'space-x-3'
    },
    lg: { 
      avatar: 'w-16 h-16 text-lg',
      text: 'text-lg',
      spacing: 'space-x-4'
    },
    xl: { 
      avatar: 'w-20 h-20 text-xl',
      text: 'text-xl',
      spacing: 'space-x-4'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Avatar background color based on variant
  const getAvatarBackground = () => {
    switch (colorVariant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary-500 to-secondary-500';
      case 'consistent':
        return getUserAvatarColor(user.id);
      case 'solid':
      default:
        return 'bg-primary-500';
    }
  };

  const containerClasses = `
    flex items-center ${config.spacing} 
    ${onClick ? 'cursor-pointer' : ''} 
    ${hoverEffect ? 'hover:opacity-80 transition-opacity duration-200' : ''} 
    ${className}
  `.trim();

  const avatarClasses = `
    ${config.avatar} 
    ${getAvatarBackground()} 
    rounded-full 
    flex items-center justify-center 
    text-white font-bold 
    flex-shrink-0
    ${hoverEffect ? 'transform hover:scale-105 transition-transform duration-200' : ''}
  `.trim();

  const initials = getUserInitials(user);
  const displayName = getUserDisplayName(user);

  return (
    <div className={containerClasses} onClick={onClick}>
      <div className={avatarClasses}>
        {initials}
      </div>
      
      {(showName || showUsername) && (
        <div className="flex-1 min-w-0">
          {showName && (
            <div className={`font-medium text-gray-900 dark:text-gray-100 truncate ${config.text}`}>
              {displayName}
            </div>
          )}
          {showUsername && user.username && (
            <div className={`text-gray-500 dark:text-gray-400 truncate ${config.text === 'text-xl' ? 'text-lg' : config.text === 'text-lg' ? 'text-base' : 'text-sm'}`}>
              @{user.username}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Specialized variants for common use cases
export const UserAvatarWithName = ({ user, size = 'md', className = '', onClick = null }) => (
  <UserAvatar 
    user={user} 
    size={size} 
    showName={true} 
    showUsername={true}
    className={className}
    onClick={onClick}
    hoverEffect={!!onClick}
  />
);

export const UserAvatarSmall = ({ user, className = '', onClick = null }) => (
  <UserAvatar 
    user={user} 
    size="sm" 
    className={className}
    onClick={onClick}
    hoverEffect={!!onClick}
  />
);

export const UserAvatarLarge = ({ user, showName = true, className = '', onClick = null }) => (
  <UserAvatar 
    user={user} 
    size="lg" 
    showName={showName}
    showUsername={showName}
    className={className}
    onClick={onClick}
    hoverEffect={!!onClick}
  />
);

export default UserAvatar;
