
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Registration, Event } from '../types';
import { Ticket, Calendar, MapPin, QrCode, Search, Inbox } from 'lucide-react';

const MyTickets = () => {
  const [tickets, setTickets] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<Registration[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const events = await db.getEvents();
        setEvents(events);
        const registrations = await db.getRegistrations();
//         // const even = await db.getEvents();

//         const mergedData = registrations.map(reg => {
//   const event = events.find(e => e.id === reg.eventId);

//   return {
//     ...reg,
//     endDate: event?.endDate,
//     endTime: event?.endTime
//   };
// });

// console.log("mergedData", mergedData)
        setTickets(registrations);
      } catch (err) {
        console.error('Failed to load tickets:', err);
      }
    })();
  }, []);


  
  const handleSearch = async () => {
    const dt = Date.now();
    const results = tickets.filter(t => t.email.toLowerCase() === emailSearch.toLowerCase() );
    const even = await db.getEvents();

        const mergedData = results.map(reg => {
  const event = events.find(e => e.id === reg.eventId);

  return {
    ...reg,
    endDate: event?.endDate,
    endTime: event?.endTime
  };
});

mergedData.sort((a, b) => {
  return (
    b.endDate.localeCompare(a.endDate) ||
    b.endTime.localeCompare(a.endTime)
  );
});

setFilteredTickets(mergedData);
  };

  const getEvent = (eventId: string) => events.find(e => e.id === eventId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Tickets</h1>
        <p className="text-gray-700 mt-2 font-medium">Find your registration details using your email address.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="email"
            placeholder="Enter your registered email address..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder-gray-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          Retrieve Tickets
        </button>
      </div>

      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTickets.map(ticket => {
            const event = getEvent(ticket.eventId);

            const nowIST = new Date(
              new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                  );

                      const eventEnd = new Date(`${ticket.endDate}T${ticket.endTime}`);

                const isLive = eventEnd >= nowIST;
                console.log("eb\nd: ", ticket);

                    console.log("nowIST: ", nowIST);
                    console.log("eventEnd: ", eventEnd);
                    console.log("isLive: ", isLive);
            return (
              <div key={ticket.id} className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col group hover:scale-[1.02] transition-transform">
                <div className="bg-indigo-600 p-6 text-white relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur rounded-lg p-2">
                    <QrCode className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-black line-clamp-1 pr-12">{event?.name}</h3>
                  <p className="text-indigo-50 text-sm font-bold opacity-90">{event?.organizer}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-800 font-bold">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span>{event?.date} at {event?.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-800 font-bold">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span>{event?.venue}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Ticket Holder</p>
                    <p className="font-black text-gray-900 text-lg">{ticket.studentName}</p>
                    <p className="text-sm text-gray-700 font-bold">{ticket.college}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Ticket ID</p>
                      <p className="font-mono font-bold text-indigo-700 text-lg">{ticket.eventTicketId}</p>
                    </div>
                     {ticket.attended ? (
        <span className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
          {isLive ? "Live | Attended" : "Expired | Attended"}
        </span>
      ) : (
        <span className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
          {isLive ? "Live | Not yet Attended" : "Expired | Not Attended"}
        </span>
      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : emailSearch && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
          <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-900 font-black text-xl tracking-tight">No tickets found</p>
          <p className="text-gray-600 font-medium mt-1">Check the email and try again.</p>
        </div>
      )}

      {!emailSearch && tickets.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg shrink-0">
            <Ticket className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm text-blue-900 leading-relaxed font-medium">
            <span className="font-black text-blue-950">Privacy Note:</span> For security, tickets are searchable by email address. Enter the email you used during registration to see your virtual ticket and unique Event ID.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
