
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import { Registration, Event } from '../types';
import { 
  Search, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X,
  Mail,
  Ticket,
  Calendar,
  ChevronDown
} from 'lucide-react';

const VerifyAttendance = () => {
  const [searchParams] = useSearchParams();
  const [selectedEventId, setSelectedEventId] = useState<string>(searchParams.get('eventId') || '');
  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const allEvents = await db.getEvents();
        setEvents(allEvents);
        
        // If eventId from URL is valid, set it
        const urlEventId = searchParams.get('eventId');
        if (urlEventId && allEvents.some(e => e.id === urlEventId)) {
          setSelectedEventId(urlEventId);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    })();
  }, [searchParams]);

  function filterEventsByDate(events: Event[]) {
  const now = Date.now();

  return events.filter(e => {
    const eventEnd = new Date(`${e.endDate}T${e.endTime}`).getTime();
    return eventEnd >= now;
  });
}


  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedEventId || !ticketId.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let registrations = await db.getRegistrations();
      // Verify ticket ID and email match specifically for the selected event
      const dt = Date.now();
      // registrations = registrations.filter( ele => ele.enddate > dt);

      // let events = await db.getEvents();
      
      //  events = events.filter((e) => new Date(e.endDate).getTime() > dt);

      //  if(events.length == 0){
      //   setError("No events have been registered to verify.");
      //  }
    console.log(registrations)
      const reg = registrations.find(r => 
        r.eventId === selectedEventId &&
        r.eventTicketId.toUpperCase() === ticketId.trim().toUpperCase() && 
        r.email.toLowerCase() === email.trim().toLowerCase() 
      );

     
console.log("finding event : ",reg)
console.log("events : ",selectedEventId)

  console.log("email: ",email)
  console.log("ticketId: ",ticketId)

      if (reg) {
        setResult(reg);
        // Automatically mark as attended if not already
        if (!reg.attended) {
          await db.updateAttendance(reg.id, true);
        }
      } else {
        setError("Enter the valid input with registered email id");
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTicketId('');
    setEmail('');
    setResult(null);
    setError(null);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Attendance Verification</h1>
        <p className="text-gray-700 mt-2 font-medium">Verify student entries for a specific event.</p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          {/* Event Selection */}
          {!result && !error && (
            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2 ml-1">Step 1: Select Event</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    reset();
                  }}
                  className="block w-full pl-12 pr-10 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-gray-900 appearance-none shadow-sm cursor-pointer"
                >
                  <option value="" disabled>Choose an event to verify...</option>
                  {filterEventsByDate(events).length > 0 ? filterEventsByDate(events).map(event => (
                   
                    <option key={event.id} value={event.id}>{event.name} ({event.organizer})</option>
                  
                  )) : <option>No event has been registered</option>
                  }
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {selectedEventId && !result && !error ? (
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-600 p-3 rounded-2xl">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Step 2: Verification</h2>
                  <p className="text-sm text-gray-500 font-bold">Verifying for: {selectedEvent?.name}</p>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2 ml-1">Ticket ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Ticket className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. EVT-ABCD12"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:bg-white focus:ring-0 outline-none transition-all font-mono font-bold tracking-widest text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2 ml-1">Registered Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="student@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:bg-white focus:ring-0 outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !ticketId.trim() || !email.trim()}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 mt-2 text-lg"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Verify Entry
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : error ? (
            <div className="bg-white border border-red-100 p-10 rounded-[40px] text-center shadow-2xl animate-in fade-in zoom-in-95">
              <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 font-bold mb-8 max-w-sm mx-auto leading-relaxed">{error}</p>
              <button 
                onClick={reset} 
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg"
              >
                Try Again
              </button>
            </div>
          ) : result && (
            <div className="bg-white border border-green-100 p-10 rounded-[40px] shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-green-100 p-4 rounded-3xl">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <button onClick={reset} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="h-7 w-7" />
                </button>
              </div>

              <div className="mb-10">
                <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                  Successfully Verified
                </span>
                <h2 className="text-4xl font-black text-gray-900 mb-2">{result.studentName}</h2>
                <p className="text-gray-600 font-bold text-lg">{result.email}</p>
              </div>

              <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Scoped</p>
                  <p className="font-black text-gray-900 text-xl">{selectedEvent?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">College</p>
                    <p className="font-bold text-gray-800">{result.college}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ticket ID</p>
                    <p className="font-mono font-black text-indigo-600 text-lg">{result.ticketId}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={reset}
                className="mt-10 w-full py-5 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 transition-all text-lg"
              >
                Next Attendee
              </button>
            </div>
          )}

          {!selectedEventId && (
            <div className="bg-gray-50 border border-gray-200 border-dashed p-12 rounded-[40px] text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-black text-xl tracking-tight">Select an event first</p>
              <p className="text-gray-500 font-medium mt-2">Verification is performed within the scope of a specific event.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAttendance;
