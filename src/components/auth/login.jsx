import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        if (result.user.is_verified) {
          navigate('/');
        } else {
          navigate('/verify-email', { state: { email: result.user.email } });
        }
      }, 1500);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Login card */}
        <div className="bg-white rounded-sm shadow-xl border border-stone-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-stone-900 mb-2">
              Welcome <span className="font-semibold">Back</span>
            </h1>
            <p className="text-stone-600">
              Login to your essenceKRAFT account
            </p>
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
              <p className="text-sm text-emerald-600">✓ Login successful! Redirecting...</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
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
                  disabled={authLoading}
                />
              </div>
              {validationErrors.email && (
                <span className="text-xs text-red-600 mt-1">{validationErrors.email}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-stone-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-700 hover:text-emerald-800"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12"
                  disabled={authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <span className="text-xs text-red-600 mt-1">{validationErrors.password}</span>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg rounded-sm"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-center text-sm text-stone-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;