import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/api/placeholder/1920/1080"
          alt="Travel Background"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Explore Beautiful Places
          </h1>
          <p className="mt-6 text-xl text-white max-w-2xl mx-auto">
            Discover amazing destinations and create unforgettable memories with Rihlah.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-md p-2">
              <input
                type="text"
                placeholder="Search destinations..."
                className="flex-1 px-4 py-2 focus:outline-none"
              />
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-md flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;