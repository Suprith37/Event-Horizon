
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Event, Registration } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  ArrowLeft, 
  CheckCircle2,
  Calendar,
  MapPin,
  Loader2,
  Clock
} from 'lucide-react';

const Register = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    phone: ''
  });

  const generateTicketId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let s = formData.college.split(' ').map(w => w[0]).join('').toUpperCase();
    let result = `${s}-`;
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const events = await db.getEvents();
          console.log('Fetched events:', events);
          const found = events.find(e => e.id === id);
          if (found) setEvent(found);
          else navigate('/events');
        } catch (err) {
          console.error('Failed to load event:', err);
          navigate('/events');
        }
      })();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    
    const newTicketId = generateTicketId();
    console.log('Generated Ticket ID:', newTicketId);

    const dts =  new Date(Date.now()).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short"
});
    const registration: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: id,
      eventName: event?.name || 'Unknown Event',
      studentName: formData.name,
      email: formData.email,
      college: formData.college,
      phone: formData.phone,
      registeredAt:  Date.now(),
      attended: false,
      ticketId: newTicketId,
      eventTicketId: newTicketId 
      // userId: (await db.getCurrentUser())?.id || '' // Link registration to user
      // timestamp: Date.now(), // Ensure this field is set for backend compatibility
    };

    try {
      console.log('Submitting registration:', registration);
      const result = await db.saveRegistration(registration);
      console.log('Registration result: at jsx', result);
      setTicketId(result.eventTicketId);
      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-12 border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500">
          <div className="bg-green-600 w-24 h-24 border-2 border-black flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-black mb-4">Confirmed!</h1>
          <p className="text-gray-600 mb-10 font-black uppercase tracking-widest text-[10px]">You're registered for {event?.name}.</p>
          
          <div className="bg-gray-100 p-8 border-2 border-dashed border-black mb-10">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-3 font-black">Unique Ticket ID</p>
            <p className="text-5xl font-mono font-black text-black tracking-tighter">{ticketId}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/tickets')}
              className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-white hover:text-black transition-all"
            >
              View My Tickets
            </button>
            <button
              onClick={() => navigate('/events')}
              className="w-full py-5 bg-white text-black border-2 border-black font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
            >
              More Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Side: Info */}
        <div className="flex-1 space-y-12">
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-3 text-black font-black uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors group text-xs"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Return to Directory
          </button>

          <div className="space-y-6">
            <h1 className="text-5xl font-black text-black uppercase tracking-tight leading-none">{event?.name}</h1>
            <p className="text-lg text-gray-800 font-bold leading-relaxed border-l-4 border-black pl-8 py-2">
              {event?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Calendar className="h-8 w-8 text-black mb-6" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Schedule</p>
              <p className="text-md text-black font-black uppercase">
                {event?.date} TO {event?.endDate || event?.date}
              </p>
              <div className="flex items-center gap-2 mt-3 text-gray-600 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>{event?.time} — {event?.endTime}</span>
              </div>
            </div>
            
            <div className="p-8 bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <MapPin className="h-8 w-8 text-black mb-6" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Venue Details</p>
              <p className="text-md text-black font-black uppercase">{event?.venue}</p>
              <p className="text-sm text-gray-500 font-black mt-2 uppercase tracking-widest">{event?.organizer}</p>
            </div>
          </div>

          <div className="p-8 bg-black text-white flex items-center gap-6">
             <div className="bg-white/10 p-3">
               <CheckCircle2 className="w-8 h-8 text-white" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">Availability</p>
               <p className="text-lg font-black uppercase">Strict Limit: {event?.registrationLimit} Participants Only</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form (Fixed layout for screen fit) */}
        <div className="w-full lg:w-[450px] shrink-0">
          <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden sticky top-24">
            <div className="p-8 border-b-4 border-black bg-black text-white text-center">
              <h2 className="text-2xl font-black uppercase tracking-widest">REGISTER NOW</h2>
              <p className="text-[10px] font-black text-white/50 mt-2 uppercase tracking-[0.2em]">Student Reservation Portal</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-black uppercase tracking-[0.2em]">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-4 bg-gray-50">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="FULL NAME"
                    className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest placeholder-gray-300 outline-none focus:bg-gray-50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-black uppercase tracking-[0.2em]">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-4 bg-gray-50">
                    <Mail className="h-4 w-4 text-black" />
                  </div>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EMAIL@COLLEGE.EDU"
                    className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest placeholder-gray-300 outline-none focus:bg-gray-50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-black uppercase tracking-[0.2em]">College</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-4 bg-gray-50">
                    <School className="h-4 w-4 text-black" />
                  </div>
                  <input
                    required
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="COLLEGE NAME"
                    className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest placeholder-gray-300 outline-none focus:bg-gray-50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-black uppercase tracking-[0.2em]">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black px-4 bg-gray-50">
                    <Phone className="h-4 w-4 text-black" />
                  </div>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest placeholder-gray-300 outline-none focus:bg-gray-50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 py-6 mt-4 bg-black text-white font-black uppercase tracking-[0.3em] border-2 border-black hover:bg-white hover:text-black transition-all disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'CONFIRM ENTRY'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
