import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Mail, Lock, User, Loader2, Eye, EyeOff, P } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email format';
    }
    if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain uppercase letter';
    }
    if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must contain lowercase letter';
    }
    if (!/\d/.test(formData.password)) {
      errors.password = 'Password must contain a digit';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

    const result = await register(
      formData.email,
      formData.firstName,
      formData.lastName,
      formData.password
    );

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/verify-email', { state: { email: formData.email } });
      }, 2000);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Signup card */}
        <div className="bg-white rounded-sm shadow-xl border border-stone-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-stone-900 mb-2">
              Create <span className="font-semibold">Account</span>
            </h1>
            <p className="text-stone-600">
              Join essenceKRAFT today
            </p>
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
              <p className="text-sm text-emerald-600">✓ Account created! Redirecting to email verification...</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  disabled={authLoading}
                />
              </div>
              {validationErrors.email && (
                <span className="text-xs text-red-600 mt-1">{validationErrors.email}</span>
              )}
            </div>

            {/* Name fields in grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-12"
                  disabled={authLoading}
                />
                {validationErrors.firstName && (
                  <span className="text-xs text-red-600 mt-1">{validationErrors.firstName}</span>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-12"
                  disabled={authLoading}
                />
                {validationErrors.lastName && (
                  <span className="text-xs text-red-600 mt-1">{validationErrors.lastName}</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
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
              <p className="text-xs text-stone-500 mt-1">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 digit
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12"
                  disabled={authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</span>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg rounded-sm mt-6"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-stone-500 text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-emerald-700 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-emerald-700 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-center text-sm text-stone-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;