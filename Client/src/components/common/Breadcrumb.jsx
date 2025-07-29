import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [];

    // Always start with Home
    breadcrumbs.push({ label: 'Home', path: '/' });

    // Build breadcrumbs based on current path
    let currentPath = '';
    
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      
      // Handle specific routes
      if (pathname === 'bookclubs') {
        breadcrumbs.push({ label: 'Book Clubs', path: '/bookclubs' });
      } else if (pathname === 'create' && pathnames[index - 1] === 'bookclubs') {
        breadcrumbs.push({ label: 'Create Club', path: '/bookclubs/create' });
      } else if (pathname === 'my-clubs') {
        breadcrumbs.push({ label: 'My Clubs', path: '/bookclubs/my-clubs' });
      } else if (pathname === 'search') {
        breadcrumbs.push({ label: 'Search', path: '/bookclubs/search' });
      } else if (pathname === 'discover') {
        breadcrumbs.push({ label: 'Discover', path: '/bookclubs/discover' });
      } else if (params.id && pathname === params.id) {
        breadcrumbs.push({ label: 'Club Details', path: `/bookclubs/${params.id}` });
      } else if (pathname === 'edit' && params.id) {
        breadcrumbs.push({ label: 'Edit Club', path: `/bookclubs/${params.id}/edit` });
      } else if (pathname === 'members' && params.id) {
        breadcrumbs.push({ label: 'Members', path: `/bookclubs/${params.id}/members` });
      } else if (pathname === 'discussions' && params.id) {
        breadcrumbs.push({ label: 'Discussions', path: `/bookclubs/${params.id}/discussions` });
      } else if (pathname === 'books' && params.id) {
        breadcrumbs.push({ label: 'Reading List', path: `/bookclubs/${params.id}/books` });
      } else if (pathname === 'invite' && params.id) {
        breadcrumbs.push({ label: 'Invite Members', path: `/bookclubs/${params.id}/invite` });
      } else if (pathname === 'dashboard') {
        breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
      } else if (pathname === 'profile') {
        breadcrumbs.push({ label: 'Profile', path: '/profile' });
      } else if (pathname === 'users') {
        breadcrumbs.push({ label: 'Users', path: '/users' });
      } else if (params.id && pathnames[index - 1] === 'users') {
        breadcrumbs.push({ label: 'User Profile', path: `/users/${params.id}` });
      } else if (pathname === 'followers' && params.id) {
        breadcrumbs.push({ label: 'Followers', path: `/users/${params.id}/followers` });
      } else if (pathname === 'following' && params.id) {
        breadcrumbs.push({ label: 'Following', path: `/users/${params.id}/following` });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page or if there's only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-gray-100 py-3 px-4 border-b">
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-500 font-medium">{breadcrumb.label}</span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-blue-600 hover:text-blue-800 transition duration-300"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
