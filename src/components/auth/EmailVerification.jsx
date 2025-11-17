import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, loading } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  const handleVerification = async () => {
    setStatus('loading');
    const result = await verifyEmail(token);
    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } else {
      setStatus('error');
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-sm shadow-xl border border-stone-100 p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                  <Mail className="w-8 h-8 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-2xl font-light text-stone-900 mb-2">
                Verifying Email
              </h1>
              <p className="text-stone-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-2xl font-light text-stone-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-stone-600 mb-6">
                Your email has been successfully verified. You can now access all features.
              </p>
              <p className="text-sm text-stone-500">
                Redirecting to home page...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-700" />
                </div>
              </div>
              <h1 className="text-2xl font-light text-stone-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-red-600 mb-6 text-sm">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 rounded-sm"
                >
                  Back to Login
                </Button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  Create New Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
