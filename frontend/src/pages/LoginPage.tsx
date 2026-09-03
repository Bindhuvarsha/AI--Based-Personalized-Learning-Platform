import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { GlassCard, GlassButton, GlassInput } from '../components/GlassUI';
import { BookOpen, Eye, EyeOff, ShieldCheck, GraduationCap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate concurrent submissions
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || (err.response.status === 500 && !err.response?.data?.message)) {
        showToast('Cannot connect to backend server (port 8080). Please start the backend.', 'error');
      } else {
        showToast(err.response?.data?.message || 'Invalid email or password', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const autofill = (e: string, p: string) => {
    if (loading) return;
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative blurred background blobs for glass luminous depth */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-transparent rounded-full blur-3xl -z-10"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 -left-32 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-10 -right-32 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -z-10" 
      />

      <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/25 ring-4 ring-white/60">
              <BookOpen className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in to LearnPath <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1.5">
              Continue your personalized learning journey
            </p>
          </div>

          {/* Reusable GlassCard Container */}
          <GlassCard variant="elevated" className="p-7 sm:p-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              <GlassInput
                id="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <GlassInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <GlassButton
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                className="w-full py-3"
              >
                Sign In
              </GlassButton>
            </form>

            {/* Quick Demo Section */}
            <div className="mt-7 pt-6 border-t border-slate-200/70">
              <p className="text-xs font-medium text-slate-500 text-center mb-3">
                Quick demo login (development only)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <GlassButton
                  type="button"
                  variant="student"
                  size="sm"
                  disabled={loading}
                  onClick={() => autofill('student@example.com', 'Student@123')}
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  className="w-full py-2.5"
                >
                  Student Demo
                </GlassButton>
                <GlassButton
                  type="button"
                  variant="admin"
                  size="sm"
                  disabled={loading}
                  onClick={() => autofill('admin@example.com', 'Admin@123')}
                  icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  className="w-full py-2.5"
                >
                  Admin Demo
                </GlassButton>
              </div>
            </div>
          </GlassCard>

          {/* Footer Navigation */}
          <p className="text-center text-sm font-medium text-slate-600 mt-6">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md outline-none"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
