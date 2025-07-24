import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import BookClubLayout from '../components/bookclubs/BookClubLayout';
import { BookClubList, CreateBookClub, BookClubDetail } from '../components/bookclubs';

// Future components (placeholders for now)
const BookClubEdit = React.lazy(() => 
  Promise.resolve({ default: () => <div>Book Club Edit (Coming Soon)</div> })
);
const BookClubMembers = React.lazy(() => 
  Promise.resolve({ default: () => <div>Book Club Members (Coming Soon)</div> })
);
const BookClubDiscussions = React.lazy(() => 
  Promise.resolve({ default: () => <div>Book Club Discussions (Coming Soon)</div> })
);
const BookClubBooks = React.lazy(() => 
  Promise.resolve({ default: () => <div>Book Club Reading List (Coming Soon)</div> })
);
const BookClubInvite = React.lazy(() => 
  Promise.resolve({ default: () => <div>Invite Members (Coming Soon)</div> })
);
const MyBookClubs = React.lazy(() => 
  Promise.resolve({ default: () => <div>My Book Clubs (Coming Soon)</div> })
);

export const bookClubRoutes = (
  <Route 
    path="/bookclubs" 
    element={
      <ProtectedRoute>
        <BookClubLayout />
      </ProtectedRoute>
    }
  >
    {/* Main book club routes */}
    <Route index element={<BookClubList />} />
    <Route path="create" element={<CreateBookClub />} />
    <Route path="my-clubs" element={<MyBookClubs />} />
    
    {/* Individual book club routes */}
    <Route path=":id" element={<BookClubDetail />} />
    <Route path=":id/edit" element={<BookClubEdit />} />
    <Route path=":id/members" element={<BookClubMembers />} />
    <Route path=":id/discussions" element={<BookClubDiscussions />} />
    <Route path=":id/books" element={<BookClubBooks />} />
    <Route path=":id/invite" element={<BookClubInvite />} />
  </Route>
);

export default bookClubRoutes;
