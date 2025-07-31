import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-700 dark:bg-primary-800 text-white py-12 mt-8">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-4">About BookClub</h4>
            <p className="text-sm">
              BookClub is an online community where book lovers can connect and share their passion for reading. Join or create book clubs and start your literary journey today.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/bookclubs" className="hover:underline">Book Clubs</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Connect with Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Twitter</a>
              <a href="#" className="hover:underline">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-600 pt-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} BookClub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

