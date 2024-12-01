import React, { useState } from 'react';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-emerald-600">
              Rihlah
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-emerald-600">Home</a>
            <a href="/activities" className="text-gray-600 hover:text-emerald-600">Activities</a>
            <a href="/promos" className="text-gray-600 hover:text-emerald-600">Promos</a>
            {isLoggedIn ? (
              <>
                <a href="/cart" className="text-gray-600 hover:text-emerald-600">Cart</a>
                <div className="flex items-center space-x-4">
                  <a href="/profile" className="text-gray-600 hover:text-emerald-600">
                    <User className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={onLogout}
                    className="text-gray-600 hover:text-emerald-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <a 
                href="/login" 
                className="flex items-center text-gray-600 hover:text-emerald-600"
              >
                <LogIn className="w-5 h-5 mr-1" />
                Login
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-600 hover:text-emerald-600">Home</a>
              <a href="/activities" className="text-gray-600 hover:text-emerald-600">Activities</a>
              <a href="/promos" className="text-gray-600 hover:text-emerald-600">Promos</a>
              {isLoggedIn ? (
                <>
                  <a href="/cart" className="text-gray-600 hover:text-emerald-600">Cart</a>
                  <a href="/profile" className="text-gray-600 hover:text-emerald-600">Profile</a>
                  <button 
                    onClick={onLogout}
                    className="text-gray-600 hover:text-emerald-600 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a href="/login" className="text-gray-600 hover:text-emerald-600">Login</a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;