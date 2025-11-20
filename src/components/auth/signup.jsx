import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Mail, User, Loader2, Phone } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { phoneSignup, verifyOTP, completeProfile, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // For testing - show/hide custom OTP option
  const [showCustomOTP, setShowCustomOTP] = useState(false);
  const [customOTP, setCustomOTP] = useState('');

  const validatePhone = () => {
    const errors = {};
    if (!phone.match(/^\+?[\d\s-()]+$/) || phone.length < 10) {
      errors.phone = 'Invalid phone number';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProfile = () => {
    const errors = {};
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email format';
    }
    if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
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

  // Step 1: Request OTP
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePhone()) return;

    const result = await phoneSignup(phone);

    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  // Step 2: Verify OTP
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpToVerify = showCustomOTP && customOTP ? customOTP : otp;

    if (!otpToVerify) {
      setError('Please enter OTP');
      return;
    }

    const result = await verifyOTP(phone, otpToVerify);

    if (result.success) {
      if (result.profile_completed) {
        // Existing user - redirect to home
        setShowSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        // New user - go to profile completion
        setStep(3);
      }
    } else {
      setError(result.error || 'Invalid OTP');
    }
  };

  // Step 3: Complete Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateProfile()) return;

    const result = await completeProfile({
      phone,
      email: formData.email || null,
      username: formData.username || null,
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(result.error || 'Profile completion failed');
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
              {step === 1 && 'Create '}
              {step === 2 && 'Verify '}
              {step === 3 && 'Complete '}
              <span className="font-semibold">
                {step === 1 && 'Account'}
                {step === 2 && 'OTP'}
                {step === 3 && 'Profile'}
              </span>
            </h1>
            <p className="text-stone-600">
              {step === 1 && 'Join essenceKRAFT today'}
              {step === 2 && 'Enter the code we sent to your phone'}
              {step === 3 && 'Tell us a bit about yourself'}
            </p>
            
            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mt-4">
              <div className={`h-1 w-12 rounded-full ${step >= 1 ? 'bg-emerald-700' : 'bg-stone-200'}`} />
              <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-emerald-700' : 'bg-stone-200'}`} />
              <div className={`h-1 w-12 rounded-full ${step >= 3 ? 'bg-emerald-700' : 'bg-stone-200'}`} />
            </div>
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
          <form onSubmit={step === 1 ? handlePhoneSubmit : step === 2 ? handleOTPSubmit : handleProfileSubmit} className="space-y-5">
            {/* Step 1: Phone Number */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="+91 1234567890"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (validationErrors.phone) {
                          setValidationErrors({});
                        }
                      }}
                      className="pl-10 h-12"
                      disabled={authLoading}
                    />
                  </div>
                  {validationErrors.phone && (
                    <span className="text-xs text-red-600 mt-1">{validationErrors.phone}</span>
                  )}
                  <p className="text-xs text-stone-500 mt-1">
                    We'll send you an OTP to verify your number
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg rounded-sm mt-6"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-stone-600">
                    OTP sent to <span className="font-medium">{phone}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-emerald-700 hover:underline mt-1"
                  >
                    Change number
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 text-center text-2xl tracking-widest"
                    maxLength={6}
                    disabled={authLoading}
                  />
                </div>

                {/* Testing: Custom OTP Toggle */}
                <div className="border-t border-dashed border-stone-300 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomOTP(!showCustomOTP)}
                    className="text-xs text-stone-500 hover:text-stone-700"
                  >
                    {showCustomOTP ? '✕ Hide' : '⚙️ Testing: Use custom OTP'}
                  </button>
                  
                  {showCustomOTP && (
                    <div className="mt-2">
                      <Input
                        type="text"
                        placeholder="Enter custom OTP for testing"
                        value={customOTP}
                        onChange={(e) => setCustomOTP(e.target.value)}
                        className="h-10 text-sm"
                      />
                      <p className="text-xs text-stone-500 mt-1">
                        For testing: Enter any OTP to bypass verification
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg rounded-sm mt-6"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </>
            )}

            {/* Step 3: Complete Profile */}
            {step === 3 && (
              <>
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
                      placeholder="you@example.com (optional)"
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

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input
                      type="text"
                      name="username"
                      placeholder="username (optional)"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 h-12"
                      disabled={authLoading}
                    />
                  </div>
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
                    'Complete Signup'
                  )}
                </Button>
              </>
            )}

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