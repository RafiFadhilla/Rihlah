import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Image as ImageIcon,
  X,
  Tag,
  DollarSign,
  Upload,
  FileText
} from 'lucide-react';

const AdminPromos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    terms_condition: '',
    promo_code: '',
    promo_discount_price: 0,
    minimum_claim_price: 0
  });
  const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/promos', {
        headers: {
          'apiKey': API_KEY
        }
      });
      const data = await response.json();
      setPromos(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching promos:', error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('jwt_token');
    
    try {
      const response = await fetch('http://localhost:4000/api/v1/upload-image', {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    
    try {
      const url = selectedPromo
        ? `http://localhost:4000/api/v1/update-promo/${selectedPromo.id}`
        : 'http://localhost:4000/api/v1/create-promo';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPromos();
        setShowModal(false);
        setSelectedPromo(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving promo:', error);
      alert('Failed to save promo');
    }
  };

  const handleDelete = async (promoId) => {
    if (!window.confirm('Are you sure you want to delete this promo?')) return;

    const token = localStorage.getItem('jwt_token');
    
    try {
      const response = await fetch(`http://localhost:4000/api/v1/delete-promo/${promoId}`, {
        method: 'DELETE',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPromos();
      }
    } catch (error) {
      console.error('Error deleting promo:', error);
      alert('Failed to delete promo');
    }
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      terms_condition: '',
      promo_code: '',
      promo_discount_price: 0,
      minimum_claim_price: 0
    });
  };

  const filteredPromos = promos.filter(promo =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.promo_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PromoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white rounded-lg max-w-4xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedPromo ? 'Edit Promo' : 'Add New Promo'}
            </h3>
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedPromo(null);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Promo Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promo Image
              </label>
              {formData.imageUrl && (
                <div className="mb-4 relative">
                  <img
                    src={formData.imageUrl}
                    alt="Promo preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {!formData.imageUrl && (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Promo Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={formData.promo_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, promo_code: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Amount (Rp)
                </label>
                <input
                  type="number"
                  value={formData.promo_discount_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, promo_discount_price: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Claim Price (Rp)
              </label>
              <input
                type="number"
                value={formData.minimum_claim_price}
                onChange={(e) => setFormData(prev => ({ ...prev, minimum_claim_price: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms and Conditions
              </label>
              <textarea
                value={formData.terms_condition}
                onChange={(e) => setFormData(prev => ({ ...prev, terms_condition: e.target.value }))}
                rows={4}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="HTML formatted terms and conditions"
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedPromo(null);
                  resetForm();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {selectedPromo ? 'Save Changes' : 'Create Promo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Promos Management
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Promo
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search promos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

export default AdminPromos;
