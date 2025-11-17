import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Phone, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const { addPhone, verifyPhone, loading } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [verified, setVerified] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputs = useRef([]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validatePhone = (value) => {
    // Accept phone numbers with +, -, (), spaces and 10+ digits
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');

    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Invalid phone number format');
      return;
    }

    const result = await addPhone(phone);
    if (result.success) {
      setStep('otp');
      setResendTimer(60);
    } else {
      setPhoneError(result.error || 'Failed to send OTP');
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');

    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }

    const result = await verifyPhone(phone, otpString);
    if (result.success) {
      setVerified(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setOtpError(result.error || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    const result = await addPhone(phone);
    if (result.success) {
      setResendTimer(60);
      setOtp(Array(6).fill(''));
      setOtpError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-sm shadow-xl border border-stone-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-stone-900 mb-2">
              Verify <span className="font-semibold">Phone</span>
            </h1>
            <p className="text-stone-600 text-sm">
              Secure your account with phone verification
            </p>
          </div>

          {verified && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-700" />
                </div>
              </div>
              <h2 className="text-xl font-light text-stone-900 mb-2">
                Phone Verified!
              </h2>
              <p className="text-stone-600 mb-6">
                Your phone number has been successfully verified.
              </p>
              <p className="text-sm text-stone-500">
                Redirecting to home page...
              </p>
            </div>
          )}

          {!verified && (
            <>
              {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneError('');
                        }}
                        placeholder="+1 (555) 000-0000"
                        className="pl-10 h-12"
                        disabled={loading}
                      />
                    </div>
                    {phoneError && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {phoneError}
                      </span>
                    )}
                    <p className="text-xs text-stone-500 mt-2">
                      We'll send you a 6-digit code via SMS
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 rounded-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 text-stone-600 hover:text-stone-700 py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Skip for now
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-stone-700">
                        Enter OTP
                      </label>
                      <span className="text-xs text-stone-500">
                        Code expires in 5 min
                      </span>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="w-12 h-12 text-center text-xl font-semibold border border-stone-300 rounded-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                          disabled={loading}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <span className="text-xs text-red-600 block">
                        {otpError}
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 rounded-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center text-sm">
                    {resendTimer > 0 ? (
                      <p className="text-stone-600">
                        Resend code in <span className="font-semibold">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-emerald-700 hover:text-emerald-800 font-medium disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Change Phone Number */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setPhone('');
                      setOtp(Array(6).fill(''));
                      setOtpError('');
                    }}
                    className="w-full text-stone-600 hover:text-stone-700 text-sm py-2"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-sm">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Why verify?</span> Phone verification helps keep your account secure and enables two-factor authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
