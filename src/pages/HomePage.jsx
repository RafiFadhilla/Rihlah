import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/Hero/HeroSection.jsx';
import ActivityCard from './ActivityCard.jsx';
import PromoCard from '../components/Promo/PromoCard.jsx';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
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

    // Fetch promos
    fetch('http://localhost:4000/api/v1/promos', {
      headers: {
        'apiKey': API_KEY
      }
    })
      .then(res => res.json())
      .then(data => setPromos(data.data || []));

    // Fetch categories
    fetch('http://localhost:4000/api/v1/categories', {
      headers: {
        'apiKey': API_KEY
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <a href="/categories" className="text-emerald-600 flex items-center hover:text-emerald-700">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <a
              key={category.id}
              href={`/category/${category.id}`}
              className="relative rounded-lg overflow-hidden h-32 transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={category.imageUrl || "/api/placeholder/300/200"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">{category.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Activities</h2>
          <a href="/activities" className="text-emerald-600 flex items-center hover:text-emerald-700">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.slice(0, 6).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Current Promos Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Current Promos</h2>
          <a href="/promos" className="text-emerald-600 flex items-center hover:text-emerald-700">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.slice(0, 3).map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Stay updated with our latest travel deals, new destinations, and exciting promotions.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-emerald-600 px-6 py-2 rounded-md font-semibold hover:bg-emerald-50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
          Why Choose Rihlah?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Best Price Guarantee",
              description: "We offer competitive prices and regular promotional deals for the best value."
            },
            {
              title: "Trusted Partners",
              description: "We work with reliable travel partners to ensure quality service."
            },
            {
              title: "24/7 Support",
              description: "Our customer service team is always ready to assist you."
            }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;