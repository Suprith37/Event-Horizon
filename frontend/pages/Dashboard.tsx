
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Event, Registration } from '../types';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Download, 
  ChevronRight,
  QrCode,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState<string | null>(null);

useEffect(() => {
  (async () => {
    try {
      const user = await db.getCurrentUser();
console.log("before user:", user)
      if (!user?.id) return;

      console.log("after user:", user)

      // 1️⃣ Get all events
      const allEvents = await db.getEvents();

      // 2️⃣ Filter events created by logged-in user
      const userEvents = allEvents.filter(e => e.userId === user.id);

      setEvents(userEvents.sort((a, b) => b.createdAt - a.createdAt));

      // 3️⃣ Get all registrations
      const allRegs = await db.getRegistrations();

      // 4️⃣ Filter registrations for ONLY those events
      const userEventIds = userEvents.map(e => e.id);

      const userRegistrations = allRegs.filter(r =>
        userEventIds.includes(r.eventId)
      );

      setRegistrations(userRegistrations);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  })();
}, []);


  const totalAttendees = registrations.filter(r => r.attended).length;
  const totalRegistrations = registrations.length;
  
  const chartData = events.slice(0, 5).map(e => ({
    name: e.name.length > 10 ? e.name.substring(0, 10).toUpperCase() + '...' : e.name.toUpperCase(),
    registrations: registrations.filter(r => r.eventId === e.id).length,
    attendance: registrations.filter(r => r.eventId === e.id && r.attended).length
  }));

  const exportToCSV = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const eventRegs = registrations.filter(r => r.eventId === eventId);
    
    const headers = ['Name', 'Email', 'College', 'Phone', 'Attended'];
    const rows = eventRegs.map(r => [
      r.studentName, r.email, r.college, r.phone, r.attended ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event?.name.replace(/\s+/g, '_')}_attendees.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedEventRegs = registrations.filter(r => r.eventId === selectedEventId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 border-l-8 border-black pl-8 py-2">
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">Management Console • Performance Metrics</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Events", value: events.length, icon: Calendar, bg: "bg-white" },
          { label: "Bookings", value: totalRegistrations, icon: Users, bg: "bg-white" },
          { label: "Verified", value: totalAttendees, icon: CheckCircle, bg: "bg-black text-white" },
          { label: "Retention", value: (totalRegistrations > 0 ? Math.round((totalAttendees / totalRegistrations) * 100) : 0) + "%", icon: TrendingUp, bg: "bg-white" }
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between`}>
             <div>
               <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${stat.bg === 'bg-black text-white' ? 'text-white/60' : 'text-gray-400'}`}>{stat.label}</p>
               <p className="text-3xl font-black leading-none">{stat.value}</p>
             </div>
             <stat.icon className={`w-10 h-10 ${stat.bg === 'bg-black text-white' ? 'text-white/20' : 'text-black/10'}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-sm font-black text-black uppercase tracking-widest mb-10 border-b-2 border-black pb-4">Activity Matrix</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#000" fontSize={10} tickLine={false} axisLine={true} fontWeight="900" />
                <YAxis stroke="#000" fontSize={10} tickLine={false} axisLine={true} fontWeight="900" />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ border: '2px solid black', borderRadius: '0', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Bar dataKey="registrations" fill="#000" barSize={30} />
                <Bar dataKey="attendance" fill="#ddd" barSize={30} stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <h2 className="text-sm font-black text-black uppercase tracking-widest mb-6 border-b-2 border-black pb-4">Event Registry</h2>
          <div className="flex-grow overflow-y-auto no-scrollbar space-y-4 pr-2">
            {events.length === 0 && <p className="text-gray-400 font-black text-[10px] text-center py-20 uppercase tracking-widest">Database Empty</p>}
            {events.map((event: { id: any; name: any; date: string | number | Date; }) => (
              <div key={event.id} className="flex gap-2">
                <button
                  onClick={() => setSelectedEventId(event.id)}
                  className={`flex-grow flex items-center justify-between p-4 border-2 transition-all ${
                    selectedEventId === event.id 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-black hover:bg-gray-50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-black text-[11px] uppercase tracking-tight line-clamp-1">{event.name}</p>
                    <p className="text-[9px] font-black uppercase opacity-60 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${selectedEventId === event.id ? 'text-white' : 'text-black'}`} />
                </button>
                <button
                  onClick={() => setShowQRModal(event.id)}
                  className="p-4 border-2 border-black text-black hover:bg-gray-100"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEventId && (
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-8 bg-gray-50 border-b-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">{selectedEvent?.name}</h2>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Booked: {selectedEventRegs.length}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Present: {selectedEventRegs.filter(r => r.attended).length}</span>
              </div>
            </div>
            <button
              onClick={() => exportToCSV(selectedEventId)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-white hover:text-black transition-all text-xs"
            >
              <Download className="h-4 w-4" />
              CSV EXPORT
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">PARTICIPANT</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">INSTITUTION</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">TICKET_ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">STATUS</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/5">
                {selectedEventRegs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em] text-[12px]">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  selectedEventRegs.map(reg => (
                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-black uppercase">{reg.studentName}</p>
                        <p className="text-[9px] text-gray-400 font-bold mt-1">{reg.email}</p>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black uppercase text-black">{reg.college}</td>
                      <td className="px-8 py-6 text-[10px] font-mono font-black text-indigo-600">{reg.ticketId}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 border-2 border-black text-[9px] font-black uppercase tracking-widest ${
                          reg.attended ? 'bg-green-100 text-green-700' : 'bg-white text-gray-400'
                        }`}>
                          {reg.attended ? 'PRESENT' : 'PENDING'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={async () => {
                            try {
                              await db.updateAttendance(reg.id, !reg.attended);
                              const regs = await db.getRegistrations();
                              setRegistrations(regs);
                            } catch (err) {
                              console.error('Failed to update attendance:', err);
                            }
                          }}
                          className={`text-[10px] font-black uppercase tracking-widest underline decoration-2 transition-all ${reg.attended ? 'text-gray-400 hover:text-red-600 decoration-gray-400 hover:decoration-red-600' : 'text-indigo-600 hover:text-black decoration-indigo-600 hover:decoration-black'}`}
                        >
                          {reg.attended ? 'VOID' : 'VERIFY'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code Modal - Sharp box style */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black w-full max-w-sm overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="p-6 flex justify-between items-center border-b-2 border-black bg-gray-50">
              <h3 className="text-sm font-black text-black uppercase tracking-widest">Gate QR Code</h3>
              <button onClick={() => setShowQRModal(null)} className="p-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-10 text-center">
              <div className="bg-white p-6 border-4 border-black inline-block mb-8">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}#/verify?eventId=${showQRModal}`)}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs font-black text-black uppercase tracking-tight">{events.find(e => e.id === showQRModal)?.name}</p>
              <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.2em]">Official Check-in Terminal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
