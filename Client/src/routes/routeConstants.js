// Route constants for the application
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',

  // Book club routes
  BOOK_CLUBS: '/bookclubs',
  BOOK_CLUBS_CREATE: '/bookclubs/create',
  BOOK_CLUBS_MY_CLUBS: '/bookclubs/my-clubs',
  BOOK_CLUBS_SEARCH: '/bookclubs/search',
  BOOK_CLUBS_DISCOVER: '/bookclubs/discover',
  
  // Dynamic book club routes (use with parameters)
  BOOK_CLUB_DETAIL: '/bookclubs/:id',
  BOOK_CLUB_EDIT: '/bookclubs/:id/edit',
  BOOK_CLUB_MEMBERS: '/bookclubs/:id/members',
  BOOK_CLUB_DISCUSSIONS: '/bookclubs/:id/discussions',
  BOOK_CLUB_BOOKS: '/bookclubs/:id/books',
  BOOK_CLUB_INVITE: '/bookclubs/:id/invite',

  // Legacy redirects
  OLD_CLUB_DETAIL: '/club/:id',
  OLD_CLUBS: '/clubs',
};

// Helper functions to generate dynamic routes
export const generateBookClubRoutes = (id) => ({
  detail: `/bookclubs/${id}`,
  edit: `/bookclubs/${id}/edit`,
  members: `/bookclubs/${id}/members`,
  discussions: `/bookclubs/${id}/discussions`,
  books: `/bookclubs/${id}/books`,
  invite: `/bookclubs/${id}/invite`,
});

// Route groups for easier management
export const ROUTE_GROUPS = {
  PUBLIC: [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP],
  PROTECTED: [ROUTES.DASHBOARD, ROUTES.PROFILE],
  ADMIN: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_ANALYTICS,
    ROUTES.ADMIN_BOOKS,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_SETTINGS,
  ],
  BOOK_CLUBS: [
    ROUTES.BOOK_CLUBS,
    ROUTES.BOOK_CLUBS_CREATE,
    ROUTES.BOOK_CLUBS_MY_CLUBS,
    ROUTES.BOOK_CLUBS_SEARCH,
    ROUTES.BOOK_CLUBS_DISCOVER,
  ],
  BOOK_CLUB_DETAIL: [
    ROUTES.BOOK_CLUB_DETAIL,
    ROUTES.BOOK_CLUB_EDIT,
    ROUTES.BOOK_CLUB_MEMBERS,
    ROUTES.BOOK_CLUB_DISCUSSIONS,
    ROUTES.BOOK_CLUB_BOOKS,
    ROUTES.BOOK_CLUB_INVITE,
  ],
};

export default ROUTES;
