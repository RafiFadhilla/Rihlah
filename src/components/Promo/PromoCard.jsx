import React from 'react';
import { Tag, ArrowRight } from 'lucide-react';

const PromoCard = ({ promo }) => {
  const {
    title,
    description,
    imageUrl,
    promo_code,
    promo_discount_price,
    minimum_claim_price
  } = promo;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={imageUrl || "/api/placeholder/400/300"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Tag className="w-4 h-4 mr-1" />
          <span className="font-medium">{promo_code}</span>
        </div>

        <div className="space-y-2">
          <div className="text-emerald-600 font-semibold">
            Save up to Rp {promo_discount_price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Min. spend Rp {minimum_claim_price.toLocaleString()}
          </div>
        </div>

        <button className="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 flex items-center justify-center">
          Learn More
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PromoCard;