import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, Tag, CreditCard } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('http://localhost:4000/api/v1/carts', {
          headers: {
            'apiKey': API_KEY,
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setCartItems(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/payment-methods', {
          headers: {
            'apiKey': API_KEY
          }
        });
        const data = await response.json();
        setPaymentMethods(data.data || []);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchCart();
    fetchPaymentMethods();
  }, []);

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:4000/api/v1/update-cart/${cartId}`, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        setCartItems(cartItems.map(item => 
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        ));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:4000/api/v1/delete-cart/${cartId}`, {
        method: 'DELETE',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== cartId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:4000/api/v1/create-transaction', {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartIds: cartItems.map(item => item.id),
          paymentMethodId: selectedPaymentMethod
        })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/transaction/${data.data.id}`;
      } else {
        throw new Error('Failed to create transaction');
      }
    } catch (error) {
      alert('Error creating transaction. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.activity.price_discount || item.activity.price) * item.quantity, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Your cart is empty</p>
            <a 
              href="/activities" 
              className="inline-block mt-4 text-emerald-600 hover:text-emerald-700"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 border-b last:border-b-0">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={item.activity.imageUrls[0]}
                        alt={item.activity.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-lg font-semibold">
                            {item.activity.title}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {item.activity.city}, {item.activity.province}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-md hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-md hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            {item.activity.price_discount && (
                              <p className="text-sm text-gray-500 line-through">
                                Rp {item.activity.price.toLocaleString()}
                              </p>
                            )}
                            <p className="text-lg font-semibold text-emerald-600">
                              Rp {((item.activity.price_discount || item.activity.price) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                      <Tag className="w-4 h-4 mr-2" />
                      Apply
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                          {method.name}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      Rp {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      Rp {subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!selectedPaymentMethod}
                  className="w-full bg-emerald-600 text-white py-3 rounded-md font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;