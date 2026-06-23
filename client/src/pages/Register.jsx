import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { RiUserLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiShuffleLine } from 'react-icons/ri';

const ADJECTIVES = ['Silent', 'Neon', 'Ghost', 'Shadow', 'Secret', 'Curious', 'Mystic', 'Hidden', 'Phantom', 'Cosmic', 'Wandering', 'Quiet'];
const NOUNS = ['Coder', 'Panda', 'Shadow', 'Fox', 'Owl', 'Wolf', 'Ranger', 'Ninja', 'Ghost', 'Voyager', 'Nomad', 'Knight'];

function Register() {
  const [formData, setFormData] = useState({
    anonymousName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { anonymousName, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      navigate('/');
    }

    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [user, isError, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerateName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({
      ...prev,
      anonymousName: `${adj}${noun}${num}`,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!anonymousName || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    dispatch(register({ anonymousName, email, password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in px-4 py-8">
      <div className="glass max-w-md w-full p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-cyan" />
        
        {/* Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="text-3xl font-extrabold tracking-tight gradient-text">
            Zylo
          </Link>
          <h2 className="text-2xl font-bold text-white">Create an account</h2>
          <p className="text-gray-400 text-sm">Join the network anonymously</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anonymous Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">Anonymous Username</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <RiUserLine className="text-xl" />
                </span>
                <input
                  type="text"
                  name="anonymousName"
                  value={anonymousName}
                  onChange={handleChange}
                  placeholder="e.g. NeonPanda404"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 text-white placeholder-gray-500 transition-all outline-none"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateName}
                title="Generate random name"
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 text-accent transition-all flex items-center justify-center"
              >
                <RiShuffleLine className="text-xl" />
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <RiMailLine className="text-xl" />
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 text-white placeholder-gray-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <RiLockLine className="text-xl" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 text-white placeholder-gray-500 transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <RiEyeOffLine className="text-xl" /> : <RiEyeLine className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <RiLockLine className="text-xl" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 text-white placeholder-gray-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold btn-gradient text-white shadow-lg hover:shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-semibold">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
