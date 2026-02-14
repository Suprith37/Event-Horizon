
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, School } from 'lucide-react';
import { db } from '../services/db';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const user = await db.authenticateUser(formData.email, formData.password);
        if (user) {
          window.dispatchEvent(new Event('storage'));
          // const from = (location.state as any)?.from?.pathname || '/dashboard';
          const from = '/';
          navigate(from, { replace: true });
        } else {
          setError('Invalid email or password.');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        await db.saveUser({
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          college: formData.college,
          password: formData.password,
          createdAt: Date.now()
        } as any);

        const user = await db.authenticateUser(formData.email, formData.password);
        if (user) {
          window.dispatchEvent(new Event('storage'));
          navigate('/dashboard');
        } else {
          setError('Registration succeeded but login failed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className={`w-full transition-all duration-300 ${isLogin ? 'max-w-md' : 'max-w-xl'}`}>
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black p-8 text-white text-center border-b-2 border-black">
            <div className="bg-white p-3 w-14 h-14 border-2 border-white flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest">{isLogin ? 'LOGIN' : 'SIGN UP'}</h1>
            <p className="text-gray-300 mt-2 text-[10px] font-black uppercase tracking-widest opacity-80">
              {isLogin ? 'Access your dashboard' : 'Join the EventHub community'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-600 text-red-600 text-[10px] font-black uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className={`grid gap-6 ${isLogin ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-3">
                        <User className="h-4 w-4 text-black" />
                      </div>
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="NAME"
                        className="block w-full pl-16 pr-4 py-4 text-xs bg-gray-50 border-2 border-black font-black text-black placeholder-gray-400 outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">College</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-3">
                        <School className="h-4 w-4 text-black" />
                      </div>
                      <input
                        required
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="COLLEGE"
                        className="block w-full pl-16 pr-4 py-4 text-xs bg-gray-50 border-2 border-black font-black text-black placeholder-gray-400 outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className={`space-y-2 ${!isLogin ? 'md:col-span-2' : ''}`}>
                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-3">
                    <Mail className="h-4 w-4 text-black" />
                  </div>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EMAIL"
                    className="block w-full pl-16 pr-4 py-4 text-xs bg-gray-50 border-2 border-black font-black text-black placeholder-gray-400 outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-3">
                    <Lock className="h-4 w-4 text-black" />
                  </div>
                  <input
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="PASSWORD"
                    className="block w-full pl-16 pr-4 py-4 text-xs bg-gray-50 border-2 border-black font-black text-black placeholder-gray-400 outline-none focus:bg-white"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Confirm</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-3">
                      <Lock className="h-4 w-4 text-black" />
                    </div>
                    <input
                      required
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="CONFIRM"
                      className="block w-full pl-16 pr-4 py-4 text-xs bg-gray-50 border-2 border-black font-black text-black placeholder-gray-400 outline-none focus:bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-5 bg-black text-white font-black uppercase tracking-[0.3em] border-2 border-black hover:bg-white hover:text-black transition-all disabled:opacity-50 text-xs"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Sign Up'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[10px] font-black text-gray-500 hover:text-black transition-all uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-black"
              >
                {isLogin ? "Need an account? Register" : "Have an account? Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
