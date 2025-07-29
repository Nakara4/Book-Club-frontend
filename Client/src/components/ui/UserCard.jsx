import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../../features/follows/components/FollowButton';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

/**
 * Reusable UserCard component with FollowButton integration
 * Supports lazy loading of follow status using intersection observer
 */
const UserCard = ({
  user,
  showFollowButton = true,
  showRole = true,
  showStatus = true,
  showEmail = true,
  showJoinDate = false,
  size = 'md',
  layout = 'horizontal',
  className = '',
  linkToProfile = true,
  onFollowChange,
  ...props
}) => {
  // Use intersection observer for lazy loading follow status
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Load 100px before the element comes into view
    triggerOnce: true
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Size variants for avatar and text
  const sizeConfig = {
    sm: {
      avatar: 'w-8 h-8',
      name: 'text-sm font-medium',
      email: 'text-xs',
      joinDate: 'text-xs',
      spacing: 'space-x-2',
      padding: 'p-3'
    },
    md: {
      avatar: 'w-12 h-12',
      name: 'text-lg font-medium',
      email: 'text-sm',
      joinDate: 'text-sm',
      spacing: 'space-x-4',
      padding: 'p-4'
    },
    lg: {
      avatar: 'w-16 h-16',
      name: 'text-xl font-semibold',
      email: 'text-base',
      joinDate: 'text-base',
      spacing: 'space-x-6',
      padding: 'p-6'
    }
  };

  const config = sizeConfig[size];

  // User info content
  const UserInfo = () => (
    <div className="flex-1 min-w-0">
      <h3 className={`${config.name} text-gray-800 truncate`}>
        {user.name}
      </h3>
      {showEmail && user.email && (
        <p className={`${config.email} text-gray-600 truncate`}>
          {user.email}
        </p>
      )}
      {showJoinDate && user.joinDate && (
        <p className={`${config.joinDate} text-gray-500`}>
          Joined {new Date(user.joinDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );

  // Avatar component
  const Avatar = () => (
    <div className={`${config.avatar} bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0`}>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={`${config.avatar} rounded-full object-cover`}
        />
      ) : (
        <span className="text-gray-600 font-medium text-sm">
          {getInitials(user.name)}
        </span>
      )}
    </div>
  );

  // Status and role indicators
  const StatusIndicators = () => (
    <div className="flex items-center space-x-3 flex-shrink-0">
      {showRole && user.role && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
        >
          {user.role}
        </span>
      )}
      {showStatus && user.hasOwnProperty('isActive') && (
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              user.isActive ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={user.isActive ? 'Active' : 'Inactive'}
          />
        </div>
      )}
    </div>
  );

  // Follow button with lazy loading
  const LazyFollowButton = () => {
    if (!showFollowButton || !user.id) return null;
    
    return (
      <div className="ml-auto flex-shrink-0">
        {hasIntersected ? (
          <FollowButton
            targetUserId={user.id}
            size={size === 'lg' ? 'md' : 'sm'}
            variant="outline"
            onFollowChange={onFollowChange}
            className="ml-2"
          />
        ) : (
          // Placeholder to maintain layout while loading
          <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse ml-2" />
        )}
      </div>
    );
  };

  // Layout variants
  const renderHorizontalLayout = () => (
    <div
      ref={ref}
      className={`
        flex items-center justify-between ${config.padding} 
        border border-gray-200 rounded-lg hover:bg-gray-50 
        transition duration-200 ${className}
      `}
      {...props}
    >
      <div className={`flex items-center ${config.spacing} flex-1 min-w-0`}>
        {linkToProfile ? (
          <Link to={`/profile/${user.id}`} className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar />
            <UserInfo />
          </Link>
        ) : (
          <>
            <Avatar />
            <UserInfo />
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-3 ml-4">
        <StatusIndicators />
        <LazyFollowButton />
      </div>
    </div>
  );

  const renderVerticalLayout = () => (
    <div
      ref={ref}
      className={`
        flex flex-col items-center text-center ${config.padding}
        border border-gray-200 rounded-lg hover:bg-gray-50 
        transition duration-200 ${className}
      `}
      {...props}
    >
      {linkToProfile ? (
        <Link to={`/profile/${user.id}`} className="flex flex-col items-center space-y-2">
          <Avatar />
          <UserInfo />
        </Link>
      ) : (
        <>
          <Avatar />
          <div className="mt-3">
            <UserInfo />
          </div>
        </>
      )}
      
      <div className="flex items-center justify-center space-x-3 mt-3">
        <StatusIndicators />
        <LazyFollowButton />
      </div>
    </div>
  );

  const renderGridLayout = () => (
    <div
      ref={ref}
      className={`
        ${config.padding} border border-gray-200 rounded-lg 
        hover:bg-gray-50 transition duration-200 ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        {linkToProfile ? (
          <Link 
            to={`/profile/${user.id}`} 
            className={`flex items-center ${config.spacing}`}
          >
            <Avatar />
            <UserInfo />
          </Link>
        ) : (
          <div className={`flex items-center ${config.spacing}`}>
            <Avatar />
            <UserInfo />
          </div>
        )}
        <LazyFollowButton />
      </div>
      
      <div className="flex items-center justify-between">
        <StatusIndicators />
      </div>
    </div>
  );

  // Render based on layout
  switch (layout) {
    case 'vertical':
      return renderVerticalLayout();
    case 'grid':
      return renderGridLayout();
    case 'horizontal':
    default:
      return renderHorizontalLayout();
  }
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
    isActive: PropTypes.bool,
    joinDate: PropTypes.string
  }).isRequired,
  showFollowButton: PropTypes.bool,
  showRole: PropTypes.bool,
  showStatus: PropTypes.bool,
  showEmail: PropTypes.bool,
  showJoinDate: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  layout: PropTypes.oneOf(['horizontal', 'vertical', 'grid']),
  className: PropTypes.string,
  linkToProfile: PropTypes.bool,
  onFollowChange: PropTypes.func
};

export default UserCard;
