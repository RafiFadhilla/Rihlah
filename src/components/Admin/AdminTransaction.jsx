import React, { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Clock, ChevronDown, Eye, FileCheck } from 'lucide-react';
import { StatusBadge } from './TransactionDetail';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('http://localhost:4000/api/v1/all-transactions', {
          headers: {
            'apiKey': API_KEY,
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTransactions(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (transactionId, status) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:4000/api/v1/update-transaction-status/${transactionId}`, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setTransactions(prevTransactions =>
          prevTransactions.map(transaction =>
            transaction.id === transactionId ? { ...transaction, status } : transaction
          )
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update transaction status');
    }
  };

  const toggleExpandRow = (transactionId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(transactionId)) {
      newExpandedRows.delete(transactionId);
    } else {
      newExpandedRows.add(transactionId);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((sum, item) => 
      sum + (item.activity.price_discount || item.activity.price) * item.quantity, 0
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.carts.some(cart => 
        cart.activity.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusModal = ({ transaction, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Update Transaction Status</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Status:</span>
              <StatusBadge status={transaction.status} />
            </div>

            <div className="space-y-2">
              {transaction.proofPaymentUrl && (
                <div>
                  <span className="text-gray-600 block mb-2">Payment Proof:</span>
                  <img
                    src={transaction.proofPaymentUrl}
                    alt="Payment Proof"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleUpdateStatus(transaction.id, 'success')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </button>
            <button
              onClick={() => handleUpdateStatus(transaction.id, 'failed')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction Management</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, email, or activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => {
                    const isExpanded = expandedRows.has(transaction.id);
                    return (
                      <React.Fragment key={transaction.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleExpandRow(transaction.id)}
                                className="mr-2 focus:outline-none"
                              >
                                <ChevronDown
                                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                              <span className="text-sm font-medium text-gray-900">
                                {transaction.id}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={transaction.user.profilePictureUrl || "/api/placeholder/32/32"}
                                alt=""
                                className="h-8 w-8 rounded-full"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {transaction.user.name || transaction.user.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={transaction.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Rp {calculateTotalAmount(transaction.carts).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setShowModal(true);
                                }}
                                className="text-gray-400 hover:text-emerald-600"
                                title="Review Transaction"
                              >
                                <FileCheck className="w-5 h-5" />
                              </button>
                              <a
                                href={`/transaction/${transaction.id}`}
                                className="text-gray-400 hover:text-emerald-600"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                {transaction.carts.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center space-x-4"
                                  >
                                    <img
                                      src={item.activity.imageUrls[0]}
                                      alt={item.activity.title}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium">
                                        {item.activity.title}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      {item.activity.price_discount && (
                                        <p className="text-sm text-gray-500 line-through">
                                          Rp {item.activity.price.toLocaleString()}
                                        </p>
                                      )}
                                      <p className="font-medium">
                                        Rp {((item.activity.price_discount || item.activity.price) * item.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                                {transaction.proofPaymentUrl && (
                                  <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      Payment Proof:
                                    </p>
                                    <img
                                      src={transaction.proofPaymentUrl}
                                      alt="Payment Proof"
                                      className="h-32 object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && selectedTransaction && (
        <StatusModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminTransactions;
