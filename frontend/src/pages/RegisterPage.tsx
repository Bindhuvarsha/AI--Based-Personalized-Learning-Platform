import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { GlassCard, GlassButton, GlassInput } from '../components/GlassUI';
import { BookOpen, Eye, EyeOff, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!fullName || !email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }
    setLoading(true);
    try {
      await register(fullName, email, password, 'STUDENT');
      showToast('Account created! Welcome to LearnPath AI.', 'success');
      navigate('/onboarding');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative background glow blobs */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-transparent rounded-full blur-3xl -z-10"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 -right-32 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-10 -left-32 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -z-10" 
      />

      <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/25 ring-4 ring-white/60">
              <BookOpen className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1.5 flex items-center justify-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500 inline" />
              <span>Begin your AI-powered learning journey</span>
            </p>
          </div>

          {/* Reusable GlassCard Container */}
          <GlassCard variant="elevated" className="p-7 sm:p-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              <GlassInput
                id="fullName"
                type="text"
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                placeholder="Your full name"
                required
                autoComplete="name"
              />

              <GlassInput
                id="regEmail"
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
                id="regPassword"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
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
                Create Account
              </GlassButton>
            </form>
          </GlassCard>

          {/* Footer Link */}
          <p className="text-center text-sm font-medium text-slate-600 mt-6">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md outline-none"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
