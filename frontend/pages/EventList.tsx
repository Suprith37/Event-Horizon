
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Event, Registration } from '../types';
import { 
  Search, 
  Image as ImageIcon,
  X,
  CalendarDays,
  MapPin,
  Clock,
  Building2,
  Phone,
  Info,
  ExternalLink,
  ChevronRight,
  Users,
  PhoneCall,
  Globe
} from 'lucide-react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Live' | 'Upcoming' | 'Past' | 'All'>('All');
  const [selectedEventForModal, setSelectedEventForModal] = useState<Event | null>(null);
  
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const events = await db.getEvents();
        setEvents(events.sort((a, b) => b.createdAt - a.createdAt));
        const regs = await db.getRegistrations();
        setRegistrations(regs);
      } catch (err) {
        console.error('Failed to load events:', err);
      }
      finally {
        setLoading(false);
      }
    })();
  }, []);

  const colleges = ['All', ...new Set(events.map(e => e.organizer))];

  const  getEventStatus = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const [startH, startM] = event.time.split(':').map(Number);
    const [endH, endM] = (event.endTime || event.time).split(':').map(Number);
    
    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startH, startM, 0, 0);
    
    const endDateTime = new Date(event.endDate || event.date);
    endDateTime.setHours(endH || startH + 4, endM || startM, 0, 0);

    if (now >= startDateTime && now <= endDateTime) return 'Live';
    if (now < startDateTime) return 'Upcoming';
    return 'Past';
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventStatus(e);

    // Filter past events to only show those from the last 2 months
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const eventDate = new Date(e.date);

    let matchesTab = true;
    if (activeTab === 'Live') matchesTab = status === 'Live';
    else if (activeTab === 'Upcoming') matchesTab = status === 'Upcoming';
    else if (activeTab === 'Past') matchesTab = status === 'Past' && eventDate >= twoMonthsAgo;

    const matchesCollege = selectedCollege === 'All' || e.organizer === selectedCollege;
    const matchesState = selectedState === 'All' || e.venue.toLowerCase().includes(selectedState.toLowerCase()) || e.state.toLowerCase().includes(selectedState.toLowerCase());
    const matchesDate = !selectedDate || e.date === selectedDate;

    return matchesSearch && matchesTab && matchesCollege && matchesState && matchesDate;
  }).sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    
    // Sort order: Live (0), Upcoming (1), Past (2)
    const order = { 'Live': 0, 'Upcoming': 1, 'Past': 2 };
    
    if (order[statusA] !== order[statusB]) {
      return order[statusA] - order[statusB];
    }
    
    // Within the same status, sort by date (closest first)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCollege('All');
    setSelectedState('All');
    setSelectedDate('');
    setActiveTab('All');
  };

  return (


    <div className="bg-white min-h-screen pb-24 overflow-x-hidden text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 pb-0 border-b-2 border-black mb-10 overflow-x-auto no-scrollbar scroll-smooth">
          {['All', 'Live', 'Upcoming', 'Past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-x-2 border-t-2 border-transparent ${
                activeTab === tab ? 'bg-black text-white border-black' : 'text-black hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Panel - Sharp Box style */}
        <div className="bg-white border-4 border-black p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="relative flex-grow min-w-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-black bg-gray-50 px-3">
                <Search className="h-5 w-5 text-black" />
              </div>
              <input
                type="text"
                placeholder="SEARCH EVENTS"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-20 pr-4 py-4 bg-gray-50 border-2 border-black text-xs font-black uppercase tracking-widest text-gray-900 focus:bg-white outline-none"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <select 
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 border-2 border-black outline-none focus:bg-white min-w-[150px]"
              >
                <option value="All">COLLEGES</option>
                {colleges.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 border-2 border-black outline-none focus:bg-white min-w-[150px]"
              >
                <option value="All">REGIONS</option>
                {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
              </select>

              <div className="relative flex-grow sm:flex-grow-0">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-6 py-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 border-2 border-black outline-none focus:bg-white w-full"
                />
              </div>

              {(searchTerm || selectedCollege !== 'All' || selectedState !== 'All' || selectedDate) && (
                <button 
                  onClick={resetFilters}
                  className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Event Grid - Sharp Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-24 bg-white border-4 border-dashed border-black">
               <div className="bg-black w-24 h-24 flex items-center justify-center mx-auto mb-6">
                 <Search className="h-10 w-10 text-white" />
               </div>
               <p className="text-black font-black text-2xl tracking-tighter uppercase">No Results Found</p>
               <button onClick={resetFilters} className="mt-8 px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black border-2 border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                 Reset View
               </button>
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const status = getEventStatus(event);
              const isPast = status === 'Past';
              const eventRegs = registrations.filter(r => r.eventId === event.id).length;
              const isFull = eventRegs >= (event.registrationLimit || 100);
              
              return (
                <div 
                  key={event.id}
                  className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col h-full group"
                >
                  {/* Top Image */}
                  <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-black bg-gray-100">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                        status === 'Live' ? 'bg-green-500 text-black' : 
                        status === 'Upcoming' ? 'bg-indigo-500 text-white' : 
                        'bg-gray-400 text-black'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                        isPast || isFull ? 'bg-white text-red-600' : 'bg-white text-green-600'
                      }`}>
                        {isPast ? 'CLOSED' : isFull ? 'FULL' : 'OPEN'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h2 className="text-lg font-black text-black leading-none uppercase tracking-tight line-clamp-2 min-h-[2.5rem]">
                          {event.name}
                        </h2>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedEventForModal(event); }}
                          className="shrink-0 p-2 text-black border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        <Building2 className="w-3.5 h-3.5 text-black" />
                        <span className="truncate">{event.organizer}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-black/5 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-black">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-black uppercase">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-black">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-black uppercase">{event.time}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-black">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-black uppercase truncate" title={event.venue}>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-black">
                          <Users className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-black uppercase">{eventRegs}/{event.registrationLimit}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/register/${event.id}`)}
                      disabled={isPast}
                      className={`mt-auto w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-black transition-all ${
                        isPast 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {isPast ? 'EXPIRED' : 'GET TICKETS'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal - Sharp box style */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedEventForModal(null)}
              className="absolute top-6 right-6 p-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black z-20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="overflow-y-auto no-scrollbar">
              <div className="relative h-64 border-b-4 border-black">
                {selectedEventForModal.imageUrl ? (
                  <img src={selectedEventForModal.imageUrl} className="w-full h-full object-cover grayscale" alt="" />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 left-10">
                  <span className="px-4 py-1 bg-black text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4 inline-block border-2 border-white">
                    {selectedEventForModal.category}
                  </span>
                  <h3 className="text-4xl font-black text-white leading-none uppercase tracking-tighter">
                    {selectedEventForModal.name}
                  </h3>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-7 space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4">Event Dossier</h4>
                      <p className="text-sm text-gray-800 font-bold leading-relaxed border-2 border-black p-8 bg-gray-50">
                        {selectedEventForModal.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 bg-black text-white border-2 border-black">
                        <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">Host</h4>
                        <p className="text-xs font-black uppercase flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {selectedEventForModal.organizer}
                        </p>
                      </div>
                      <div className="p-6 border-2 border-black bg-gray-50">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Contact</h4>
                        <p className="text-xs font-black text-black flex items-center gap-2">
                          <PhoneCall className="w-4 h-4" />
                          {selectedEventForModal.phone || 'NA'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-6">
                    <div className="border-4 border-black p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 underline decoration-2 decoration-black">Timeline</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <CalendarDays className="w-5 h-5 text-black" />
                              <p className="text-[11px] font-black text-black uppercase leading-tight">
                                {new Date(selectedEventForModal.date).toDateString()} — {new Date(selectedEventForModal.endDate).toDateString()}
                              </p>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-black" />
                              <p className="text-[11px] font-black text-black uppercase">{selectedEventForModal.time} to {selectedEventForModal.endTime}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 underline decoration-2 decoration-black">Logistics</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-black" />
                              <p className="text-[11px] font-black text-black uppercase">{selectedEventForModal.venue}</p>
                            </div>
                            {selectedEventForModal.district && (
                              <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-black" />
                                <p className="text-[11px] font-black text-black uppercase">{selectedEventForModal.district}, {selectedEventForModal.state}</p>
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-black" />
                              <p className="text-[11px] font-black text-black uppercase">Max Capacity: {selectedEventForModal.registrationLimit}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t-2 border-black flex flex-col sm:flex-row gap-4">
                   <button 
                    onClick={() => { navigate(`/register/${selectedEventForModal.id}`); setSelectedEventForModal(null); }}
                    className="flex-grow py-5 bg-black text-white font-black uppercase tracking-[0.3em] border-2 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                  >
                    Confirm Attendance <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedEventForModal(null)}
                    className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest border-2 border-black hover:bg-gray-100 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
