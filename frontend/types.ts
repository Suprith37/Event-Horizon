
export interface Event {
  id: string;
  name: string;
  description: string;
  date: string; // Start Date
  endDate: string; // End Date
  time: string; // Start Time
  endTime: string; // End Time
  venue: string;
  district: string;
  state: string;
  organizer: string; // College Name
  registrationLimit: number;
  enableQr: boolean;
  createdAt: number;
  imageUrl?: string;
  category: string; // e.g. Technical, Cultural, Sports
  phone: string;
  userId?: string; // User who created the event

}

export interface Registration {
  id: string;
  eventId: string;
  eventName : string,
  studentName: string;
  email: string;
  college: string;
  phone: string;
  registeredAt: number;
  attended: boolean;
  ticketId: string;
  eventTicketId: string; // New field to link with Event's ticket system
  // timestamp: number; // For sorting and filtering
  // userId: string; // To link registration to user
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  password: string; // In a real app, this would be hashed
  createdAt: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}
