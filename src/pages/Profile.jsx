import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import useProfile from '../hooks/useProfile';
import ProfileHeader from '../components/profile/ProfileHeader';
import OrderList from '../components/profile/OrderList';
import EditProfileModal from '../components/profile/EditProfileModal';

const Profile = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSection, setActiveSection] = useState('orders');

  const {
    profile,
    orders,
    loading,
    ordersLoading,
    hasMoreOrders,
    updateProfile,
    loadMoreOrders,
  } = useProfile();

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_tokens');
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'orders',
      icon: Package,
      label: 'My Orders',
      description: 'View and track your orders'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile Details',
      description: 'Edit your personal information'
    },
    {
      id: 'addresses',
      icon: MapPin,
      label: 'Saved Addresses',
      description: 'Manage your delivery addresses'
    },
    {
      id: 'wishlist',
      icon: Heart,
      label: 'Wishlist',
      description: 'Your favorite products'
    }
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Please login to continue</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <ProfileHeader profile={profile} onEdit={handleEditProfile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* User Info in Sidebar */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Hello,</p>
                    <p className="text-sm text-gray-600">{profile.first_name}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-pink-50 text-pink-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors mt-2 border-t border-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h2>
                <OrderList
                  orders={orders}
                  loading={ordersLoading}
                  onLoadMore={loadMoreOrders}
                  hasMore={hasMoreOrders}
                />
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">First Name</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{profile.first_name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Last Name</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{profile.last_name}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Email</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{profile.email}</p>
                  </div>
                  {profile.phone && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Phone</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{profile.phone}</p>
                    </div>
                  )}
                  <button
                    onClick={handleEditProfile}
                    className="mt-4 px-4 py-2 text-sm font-medium text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'addresses' && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
                <p className="text-gray-500 text-sm mb-4">Add an address to place your orders</p>
                <button className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm font-medium">
                  Add New Address
                </button>
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 text-sm mb-4">Save your favorite items here</p>
                <a
                  href="/products"
                  className="inline-block px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm font-medium"
                >
                  Continue Shopping
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Profile;
