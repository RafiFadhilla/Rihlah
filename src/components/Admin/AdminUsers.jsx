import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Pencil, 
  Trash2, 
  X, 
  Phone,
  Mail,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordRepeat: '',
    role: 'user',
    profilePictureUrl: '',
    phoneNumber: ''
  });
  const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:4000/api/v1/all-user', {
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    
    try {
      const url = selectedUser
        ? 'http://localhost:4000/api/v1/update-profile'
        : 'http://localhost:4000/api/v1/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': selectedUser ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchUsers();
        setShowModal(false);
        setSelectedUser(null);
        setFormData({
          email: '',
          password: '',
          passwordRepeat: '',
          role: 'user',
          profilePictureUrl: '',
          phoneNumber: ''
        });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  };

  const handleUpdateRole = async (userId, role) => {
    const token = localStorage.getItem('jwt_token');
    
    try {
      const response = await fetch(`http://localhost:4000/api/v1/update-user-role/${userId}`, {
        method: 'POST',
        headers: {
          'apiKey': API_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      profilePictureUrl: user.profilePictureUrl || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const UserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {selectedUser ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedUser(null);
              setFormData({
                email: '',
                password: '',
                passwordRepeat: '',
                role: 'user',
                profilePictureUrl: '',
                phoneNumber: ''
              });
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {!selectedUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.passwordRepeat}
                  onChange={(e) => setFormData(prev => ({ ...prev, passwordRepeat: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={formData.profilePictureUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, profilePictureUrl: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedUser(null);
                setFormData({
                  email: '',
                  password: '',
                  passwordRepeat: '',
                  role: 'user',
                  profilePictureUrl: '',
                  phoneNumber: ''
                });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              {selectedUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
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
            Users Management
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={user.profilePictureUrl || "/api/placeholder/40/40"}
                    alt={user.email}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <div className="text-lg font-semibold text-gray-900">
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.role}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {user.phoneNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {user.phoneNumber}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    title="Edit user"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="p-2 rounded-lg border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new user.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && <UserModal />}
      </div>
    </div>
  );
};

export default AdminUsers;

