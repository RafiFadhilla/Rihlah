import React, { useState, useEffect } from 'react';
import ActivityCard from './ActivityCard.jsx';
import { Search, Filter, MapPin } from 'lucide-react';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

  useEffect(() => {
    // Fetch activities
    fetch('http://localhost:4000/api/v1/activities', {
      headers: {
        'apiKey': API_KEY
      }
    })
      .then(res => res.json())
      .then(data => setActivities(data.data || []));

    // Fetch categories
    fetch('http://localhost:4000/api/v1/categories', {
      headers: {
        'apiKey': API_KEY
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.categoryId === selectedCategory;
    const matchesPrice = activity.price >= priceRange[0] && activity.price <= priceRange[1];
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.province.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Search Header */}
      <div className="bg-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search activities or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <button 
                className="flex items-center justify-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-2"
                  />
                  All Categories
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">
                  Rp 0 - Rp {priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Available Activities
              </h2>
              <span className="text-gray-600">
                {filteredActivities.length} results found
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No activities found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;