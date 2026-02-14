
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight, 
  Target, 
  Heart, 
  Globe, 
  Phone, 
  Mail, 
  Twitter, 
  Instagram,
  Ticket,
  ClipboardList,
  Activity,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await db.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to load user:', err);
        setCurrentUser(null);
      }
    })();
  }, []);

  const handlePrimaryAction = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const services = [
    {
      title: "Event Planning",
      desc: "Comprehensive tools to organize, manage venues, and schedule activities with precision from start to finish.",
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Registration",
      desc: "Hassle-free participant sign-up with custom forms and automated confirmation for seamless entry.",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Real Time Analysis",
      desc: "Live dashboards providing deep insights into attendee trends and registration velocity at every moment.",
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Ticket Generation",
      desc: "Instantly create secure, unique digital tickets with verifiable Event IDs and professional QR codes.",
      icon: Ticket,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Tracking Events",
      desc: "Monitor event status from upcoming to live with real-time updates, ensuring you never miss the action.",
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Secure Verification",
      desc: "On-spot validation using high-tech scanning and encrypted ticket databases for total peace of mind.",
      icon: ShieldCheck,
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="relative isolate bg-white overflow-hidden">
      {/* Hero section */}
      <section className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" /> The Event Horizon
          </div>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl">
            Moments into <span className="text-indigo-600">Memories</span>
          </h1>
          <p className="mt-8 text-lg leading-8 text-gray-600 font-medium">
            The ultimate toolkit for college organizers and students. Create, manage, and verify event attendance with elite precision.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/events')}
              className="w-full sm:w-auto rounded-2xl bg-black px-8 py-4 text-sm font-black text-white shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Browse Events <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={handlePrimaryAction}
              className="text-sm font-black leading-6 text-gray-900 hover:text-indigo-600 transition-colors py-4 px-8"
            >
              Start Organizing <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-base font-black uppercase tracking-[0.2em] text-indigo-600 mb-4">About Us</h2>
              <h3 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Crafting Extraordinary <br/>Experiences</h3>
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                At <span className="text-indigo-600 font-black">Event Horizon</span>,  we believe in turning moments into memories and events into extraordinary experiences. With a passion for precision and an eye for detail, we specialize in creating seamless and unforgettable events tailored to your vision.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  { icon: Target, text: "Precision-driven execution" },
                  { icon: Heart, text: "Passion for storytelling" },
                  { icon: Globe, text: "Wide-reaching community impact" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-1.5 rounded-lg">
                      <item.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-gray-900 font-bold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-600/10 rounded-[40px] blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop" 
                alt="Event" 
                className="relative rounded-[40px] shadow-2xl border-8 border-white object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-black uppercase tracking-[0.2em] text-indigo-600 mb-4">What We Do</h2>
            <h3 className="text-4xl font-black text-gray-900">Services We Provide</h3>
            <p className="mt-4 text-gray-600 font-medium">Elevate your events with our industry-leading technology suite.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-indigo-200 hover:shadow-2xl transition-all group">
                <div className={`${service.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-600 font-medium leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-[40px] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 lg:max-w-md">
              <h2 className="text-base font-black uppercase tracking-[0.2em] text-white/80 mb-4">Contact Us</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">Ready to Get <br/>Started?</h3>
              <p className="mt-6 text-indigo-50 font-medium">Reach out to our specialist team and we'll help you launch your event horizon.</p>
            </div>

            <div className="relative z-10 w-full lg:max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href="tel:+919876543210" className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                <Phone className="w-8 h-8 text-white mb-4 group-hover:rotate-12 transition-transform" />
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Call Us</p>
                <p className="text-white font-bold text-lg">+91 98765 43210</p>
              </a>
              <a href="mailto:hello@eventhorizon.pro" className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                <Mail className="w-8 h-8 text-white mb-4 group-hover:-translate-y-1 transition-transform" />
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-white font-bold text-m">eventhorizon@gmail.com</p>
              </a>
              <a href="#" className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                <Twitter className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">X Platform</p>
                <p className="text-white font-bold text-lg">@EventHorizon</p>
              </a>
              <a href="#" className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                <Instagram className="w-8 h-8 text-white mb-4 group-hover:rotate-12 transition-transform" />
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Instagram</p>
                <p className="text-white font-bold text-lg">@event_horizon_pro</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
