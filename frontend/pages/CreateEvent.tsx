
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Event } from '../types';
import { 
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Phone,
  FileText,
  Tag,
  Globe
} from 'lucide-react';
import { Console } from 'console';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    endDate: '',
    time: '',
    endTime: '',
    venue: '',
    district: '',
    state: '',
    organizer: '',
    registrationLimit: 100,
    enableQr: true,
    category: 'Technical',
    phone: '',
    imageUrl: '',
    userId:''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit image size to 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Image size exceeds 5MB. Please choose a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Optionally compress by creating an image and resizing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize to max 800px width
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEventId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'EVT-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

   
    const eventId = generateEventId();
     console.log('starting eventId:', eventId);
    const newEvent: Event = {
      ...formData,
      id: eventId,
      eid: eventId, // Add eid field for backward compatibility
      createdAt: Date.now(),
      userId: (await db.getCurrentUser())?.id || '' // Link event to creator
    };

      console.log('new event id ',newEvent)
    try {
      const result = await db.saveEvent(newEvent);
      console.log('Event result:', result);
      setCreatedEvent(result);
    } catch (err: any) {
      console.error('Event creation failed:', err);
      const message = err?.message || 'Failed to create event';
      if (message.includes('fetch') || message.includes('Failed to connect')) {
        setError(`Connection failed: ${message}`);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (createdEvent) {
    console.log('Created Event:', createdEvent);
    const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify?eventId=${createdEvent.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden text-center p-12">
          <div className="bg-black w-24 h-24 border-2 border-black flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight mb-4">Event Created!</h1>
          <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mb-10">System successfully updated.</p>
          
          <div className="bg-gray-50 p-10 border-4 border-dashed border-black mb-10 inline-block">
            <img 
              src={qrCodeUrl} 
              alt="QR" 
              className="w-56 h-56 mx-auto border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="py-5 bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all"
            >
              System Dashboard
            </button>
            <a
              href={qrCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="event_qr.png"
              className="flex items-center justify-center gap-3 py-5 bg-white text-black font-black uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <Download className="h-5 w-5" />
              Download QR
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-black font-black uppercase tracking-[0.2em] hover:text-indigo-600 mb-10 transition-colors group text-xs"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Discard & Exit
      </button>

      <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black px-12 py-12 text-white border-b-4 border-black flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none">Event Forge</h1>
            <p className="text-white/50 mt-4 text-[11px] font-black uppercase tracking-[0.3em]">Initialize new project record</p>
          </div>
          <div className="hidden sm:block border-4 border-white p-5">
            <Building2 className="w-10 h-10 text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-16">
          {error && (
            <div className="p-6 bg-red-50 border-4 border-red-600 text-red-600 text-sm font-black uppercase tracking-widest">
              ⚠️ {error}
            </div>
          )}

          <section className="space-y-10">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <ImageIcon className="w-6 h-6 text-black" />
              <h2 className="text-xl font-black text-black uppercase tracking-widest">Event Data</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4">Uplooad image</label>
                <div 
                  className="relative h-72 w-full bg-gray-50 border-4 border-dashed border-black flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('imageInput')?.click()}
                >
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover " alt="Preview" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <ImageIcon className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-xs text-black font-black uppercase tracking-widest">Select Image</p>
                    </div>
                  )}
                  <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">Event Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black bg-gray-50 px-4">
                      <FileText className="h-5 w-5 text-black" />
                    </div>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ENTER TITLE"
                      className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest text-gray-900 outline-none focus:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">Event Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black bg-gray-50 px-4">
                        <Tag className="h-5 w-5 text-black" />
                      </div>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest text-gray-900 outline-none appearance-none"
                      >
                        <option value="Technical">TECHNICAL</option>
                        <option value="Cultural">CULTURAL</option>
                        <option value="Sports">SPORTS</option>
                        <option value="Other">OTHER</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">Total Tickets</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black bg-gray-50 px-4">
                        <CheckCircle2 className="h-5 w-5 text-black" />
                      </div>
                      <input
                        required
                        type="number"
                        name="registrationLimit"
                        value={formData.registrationLimit}
                        onChange={handleChange}
                        className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <Calendar className="w-6 h-6 text-black" />
              <h2 className="text-xl font-black text-black uppercase tracking-widest">Timeline</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'START_DATE', name: 'date', type: 'date' },
                { label: 'END_DATE', name: 'endDate', type: 'date' },
                { label: 'START_TIME', name: 'time', type: 'time' },
                { label: 'END_TIME', name: 'endTime', type: 'time' }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">{field.label}</label>
                  <input
                    required
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    className="block w-full px-6 py-5 bg-white border-2 border-black font-black text-xs outline-none focus:bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <MapPin className="w-6 h-6 text-black" />
              <h2 className="text-xl font-black text-black uppercase tracking-widest">Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Venue Address', name: 'venue', icon: MapPin, placeholder: 'LOCATION' },
                { label: 'District', name: 'district', icon: Globe, placeholder: 'DISTRICT' },
                { label: 'State', name: 'state', icon: Globe, placeholder: 'STATE' },
                { label: 'Organizers Name', name: 'organizer', icon: Building2, placeholder: 'DEPARTMENT' },
                { label: 'Phone Number', name: 'phone', icon: Phone, placeholder: '+91' }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black bg-gray-50 px-4">
                      <field.icon className="h-5 w-5 text-black" />
                    </div>
                    <input
                      required
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="block w-full pl-20 pr-4 py-5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest outline-none focus:bg-gray-50"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">Briefing Event</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="EVENT DETAILS......"
                className="block w-full px-8 py-6 bg-white border-2 border-black font-bold text-sm uppercase tracking-widest text-gray-900 outline-none focus:bg-gray-50 resize-none"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-8 bg-black text-white font-black uppercase tracking-[0.4em] border-4 border-black hover:bg-white hover:text-black transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-xl"
          >
            {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : 'DEPLOY EVENT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
