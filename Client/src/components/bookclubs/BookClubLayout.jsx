import React from 'react';
import { Outlet } from 'react-router-dom';

const BookClubLayout = () => {
  return (
    <div className="book-club-layout">
      <Outlet />
    </div>
  );
};

export default BookClubLayout;
