
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CheckCircle, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Ticket,
  User as UserIcon,
  LogIn
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventList from './pages/EventList';
import Register from './pages/Register';
import VerifyAttendance from './pages/VerifyAttendance';
import MyTickets from './pages/MyTickets';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { db } from './services/db';
import { User } from './types';

const ProtectedRoute = ({ children, currentUser }: { children: React.ReactNode; currentUser: User | null }) => {
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Navbar = ({ currentUser, onLogout }: { currentUser: User | null; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const baseItems = [
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'My Tickets', icon: Ticket, path: '/tickets' },
  ];

  const organizerItems = currentUser 
    ? [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Create', icon: PlusCircle, path: '/create' },
        { name: 'Verify', icon: CheckCircle, path: '/verify' },
      ]
    : [];

  const navItems = [...baseItems, ...organizerItems];

  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-black p-2 border-2 border-black">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-black tracking-tighter uppercase">EVENT HORIZON</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all ${
                  location.pathname === item.path 
                    ? 'text-white bg-black border-black' 
                    : 'text-black border-transparent hover:border-black'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            {currentUser ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l-2 border-black">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-all ${
                    location.pathname === '/profile'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{currentUser.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="p-2 border-2 border-transparent hover:border-black text-black transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 flex items-center gap-2 px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-white hover:text-black transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border-2 border-black text-black"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b-2 border-black">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 border-2 text-xs font-black uppercase tracking-widest ${
                  location.pathname === item.path ? 'bg-black text-white border-black' : 'text-black border-transparent hover:border-black'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            {currentUser && (
               <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 border-2 text-xs font-black uppercase tracking-widest ${
                  location.pathname === '/profile' ? 'bg-black text-white border-black' : 'text-black border-transparent hover:border-black'
                }`}
              >
                <UserIcon className="h-5 w-5" />
                Profile
              </Link>
            )}
            {currentUser ? (
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="flex items-center gap-3 w-full text-left px-3 py-3 border-2 border-transparent text-xs font-black uppercase tracking-widest text-black hover:border-black"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 border-2 border-black text-xs font-black uppercase tracking-widest text-black"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await db.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to load auth:', err);
        setCurrentUser(null);
      } finally {
        setLoadingAuth(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handleStorageChange = async () => {
      const user = await db.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="bg-black w-24 h-24 mx-auto mb-6" />
            <p className="text-black font-black uppercase tracking-widest">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute currentUser={currentUser}><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute currentUser={currentUser}><CreateEvent /></ProtectedRoute>} />
            <Route path="/verify" element={<ProtectedRoute currentUser={currentUser}><VerifyAttendance /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute currentUser={currentUser}><Profile /></ProtectedRoute>} />
            <Route path="/events" element={<EventList />} />
            <Route path="/register/:id" element={<Register />} />
            <Route path="/tickets" element={<MyTickets />} />
          </Routes>
        </main>
        <footer className="bg-white border-t-2 border-black py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-black text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} EVENT HORIZON • CREATED BY SUPRITH R Y • ALL RIGHTS RESERVED
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
