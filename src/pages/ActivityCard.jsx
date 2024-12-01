import React from 'react';
import { Star, MapPin } from 'lucide-react';


const ActivityCard = ({ activity }) => {
  const {
    title,
    imageUrls,
    price,
    price_discount,
    rating,
    total_reviews,
    city,
    province
  } = activity;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={imageUrls[0] || "/api/placeholder/400/300"}
          alt={title}
          className="w-full h-full object-cover"
        />
        {price_discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
            Save {((price - price_discount) / price * 100).toFixed()}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{city}, {province}</span>
        </div>

        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">
            {rating} ({total_reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {price_discount && (
              <span className="text-sm text-gray-500 line-through mr-2">
                Rp {price.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-bold text-emerald-600">
              Rp {(price_discount || price).toLocaleString()}
            </span>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;