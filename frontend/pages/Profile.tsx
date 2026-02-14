
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { User as UserIcon, Mail, School, Calendar, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await db.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-black font-black uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-black font-black uppercase tracking-widest">Not logged in</p>
      </div>
    );
  }

  const handleLogout = () => {
    db.logout();
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-black font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white border-2 border-black px-4 py-2 mb-12 transition-all text-[10px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Return
      </button>

      <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Visual/Profile Header */}
        <div className="bg-black text-white p-12 flex flex-col items-center justify-center md:w-1/3 border-b-4 md:border-b-0 md:border-r-4 border-black">
          <div className="bg-white p-6 border-4 border-white mb-6">
            <UserIcon className="w-16 h-16 text-black" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-center leading-none">{user.name}</h2>
          <div className="mt-6 px-4 py-1.5 border-2 border-white text-[9px] font-black uppercase tracking-[0.3em]">
            Official Record
          </div>
        </div>

        {/* Right Side: Account Information Details */}
        <div className="flex-1 p-12 space-y-10 bg-white text-black">
          <div className="border-b-4 border-black pb-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Sign-up Intelligence</h1>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-2">Verified System Metadata</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-start gap-6 border-2 border-black p-6 hover:bg-black hover:text-white group transition-all">
              <div className="bg-black p-3 border-2 border-black group-hover:bg-white group-hover:border-white transition-all">
                <Mail className="w-6 h-6 text-white group-hover:text-black" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100 transition-all">Email Terminal</p>
                <p className="text-lg font-black break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 border-2 border-black p-6 hover:bg-black hover:text-white group transition-all">
              <div className="bg-black p-3 border-2 border-black group-hover:bg-white group-hover:border-white transition-all">
                <School className="w-6 h-6 text-white group-hover:text-black" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100 transition-all">Affiliated Institution</p>
                <p className="text-lg font-black uppercase tracking-tight">{user.college}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 border-2 border-black p-6 hover:bg-black hover:text-white group transition-all">
              <div className="bg-black p-3 border-2 border-black group-hover:bg-white group-hover:border-white transition-all">
                <Calendar className="w-6 h-6 text-white group-hover:text-black" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100 transition-all">Member Since</p>
                <p className="text-lg font-black uppercase tracking-tight">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-grow py-5 bg-black text-white font-black uppercase tracking-[0.3em] border-2 border-black hover:bg-white hover:text-black transition-all"
            >
              Management Console
            </button>
            <button
              onClick={handleLogout}
              className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
