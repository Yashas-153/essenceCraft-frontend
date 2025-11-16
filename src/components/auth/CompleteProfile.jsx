import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, UserCircle, Loader2 } from 'lucide-react';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeProfile } = useAuth();

  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get phone from navigation state
    const phoneFromState = location.state?.phone;
    if (!phoneFromState) {
      // If no phone in state, redirect to signup
      navigate('/signup');
      return;
    }
    setPhone(phoneFromState);
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.username || !formData.first_name) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Username validation (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    const result = await completeProfile({
      phone,
      ...formData,
    });
    setLoading(false);

    if (result.success) {
      // Profile completed successfully
      navigate('/', { 
        state: { message: 'Account created successfully!' } 
      });
    } else {
      setError(result.error || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-10 h-10 text-emerald-700" />
          </div>
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            Complete Your <span className="font-semibold">Profile</span>
          </h1>
          <p className="text-stone-600">
            Just a few more details to get started
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-sm shadow-xl border border-stone-100 p-8">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Phone display */}
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
            <p className="text-sm text-emerald-800">
              Phone: <span className="font-semibold">{phone}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  type="text"
                  name="username"
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Only letters, numbers, and underscores
              </p>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                className="h-12"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Last Name <span className="text-stone-400">(Optional)</span>
              </label>
              <Input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg rounded-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </div>

        {/* Privacy note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-500">
            Your information is secure and will never be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;