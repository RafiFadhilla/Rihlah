import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Check, X, Upload, FileImage, AlertCircle } from 'lucide-react';

const TransactionStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELED: 'canceled'
};

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return 'bg-green-100 text-green-800';
      case TransactionStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case TransactionStatus.CANCELED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return <Check className="w-4 h-4" />;
      case TransactionStatus.FAILED:
        return <X className="w-4 h-4" />;
      case TransactionStatus.CANCELED:
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TransactionDetail = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const { id } = useParams();
  const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`http://localhost:4000/api/v1/transaction/${id}`, {
          headers: {
            'apiKey': API_KEY,
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTransaction(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleUploadProof = async () => {
    if (!paymentUrl) {
      alert('Please enter a valid payment proof URL');
      return;
    }

    setUploadingProof(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:4000/api/v1/update-transaction-proof-payment/${id}`, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ proofPaymentUrl: paymentUrl })
      });

      if (response.ok) {
        const data = await response.json();
        setTransaction(prev => ({ ...prev, proofPaymentUrl: data.data.proofPaymentUrl }));
        setPaymentUrl('');
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      alert('Failed to upload payment proof');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this transaction?')) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:4000/api/v1/cancel-transaction/${id}`, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransaction(prev => ({ ...prev, status: data.data.status }));
      }
    } catch (error) {
      console.error('Error canceling transaction:', error);
      alert('Failed to cancel transaction');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Transaction Not Found</h2>
          <p className="text-gray-600 mt-2">The transaction you're looking for doesn't exist.</p>
          <a href="/transactions" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
            View All Transactions
          </a>
        </div>
      </div>
    );
  }

  const totalAmount = transaction.carts.reduce(
    (sum, cart) => sum + (cart.activity.price_discount || cart.activity.price) * cart.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transaction Detail</h1>
            <p className="text-gray-600 mt-1">Transaction ID: {transaction.id}</p>
          </div>
          <StatusBadge status={transaction.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {transaction.carts.map((cart) => (
                    <div key={cart.id} className="flex flex-col md:flex-row gap-4">
                      <img
                        src={cart.activity.imageUrls[0]}
                        alt={cart.activity.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{cart.activity.title}</h3>
                        <p className="text-gray-600 mb-2">
                          {cart.activity.city}, {cart.activity.province}
                        </p>
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-gray-600">
                            Quantity: {cart.quantity}
                          </div>
                          <div>
                            {cart.activity.price_discount && (
                              <p className="text-sm text-gray-500 line-through">
                                Rp {cart.activity.price.toLocaleString()}
                              </p>
                            )}
                            <p className="text-lg font-semibold text-emerald-600">
                              Rp {((cart.activity.price_discount || cart.activity.price) * cart.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            {transaction.status === TransactionStatus.PENDING && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Upload Payment Proof</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter payment proof URL"
                      value={paymentUrl}
                      onChange={(e) => setPaymentUrl(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleUploadProof}
                      disabled={uploadingProof || !paymentUrl}
                      className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {uploadingProof ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Upload className="w-5 h-5 mr-2" />
                          Upload Proof
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Transaction Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{transaction.paymentMethod.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{transaction.carts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">Rp {totalAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-semibold text-emerald-600">
                      Rp {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {transaction.status === TransactionStatus.PENDING && (
                <button
                  onClick={handleCancel}
                  className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700"
                >
                  Cancel Transaction
                </button>
              )}

              {transaction.proofPaymentUrl && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Payment Proof</h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={transaction.proofPaymentUrl}
                      alt="Payment Proof"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;