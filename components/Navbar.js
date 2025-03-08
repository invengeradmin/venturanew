import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import authService from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return router.pathname === path ? 'bg-blue-700' : '';
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const handleLogin = () => {
    // Redirect to Cloudbeds OAuth flow
    window.location.href = authService.getAuthUrl();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Cloudbeds Tester
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/')}`}>
              Home
            </Link>
            <Link href="/tests/availability" className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/tests/availability')}`}>
              Availability
            </Link>
            <Link href="/tests/reservations" className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/tests/reservations')}`}>
              Reservations
            </Link>
            <Link href="/tests/guests" className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/tests/guests')}`}>
              Guests
            </Link>
            <Link href="/tests/payments" className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/tests/payments')}`}>
              Payments
            </Link>
            <Link href="/tests/housekeeping" className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/tests/housekeeping')}`}>
              Housekeeping
            </Link>
            
            {authService.isAuthenticated() ? (
              <button 
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                OAuth Login
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className={`block px-3 py-2 rounded ${isActive('/')}`}>
              Home
            </Link>
            <Link href="/tests/availability" className={`block px-3 py-2 rounded ${isActive('/tests/availability')}`}>
              Availability
            </Link>
            <Link href="/tests/reservations" className={`block px-3 py-2 rounded ${isActive('/tests/reservations')}`}>
              Reservations
            </Link>
            <Link href="/tests/guests" className={`block px-3 py-2 rounded ${isActive('/tests/guests')}`}>
              Guests
            </Link>
            <Link href="/tests/payments" className={`block px-3 py-2 rounded ${isActive('/tests/payments')}`}>
              Payments
            </Link>
            <Link href="/tests/housekeeping" className={`block px-3 py-2 rounded ${isActive('/tests/housekeeping')}`}>
              Housekeeping
            </Link>
            
            {authService.isAuthenticated() ? (
              <button 
                onClick={handleLogout}
                className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                OAuth Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
