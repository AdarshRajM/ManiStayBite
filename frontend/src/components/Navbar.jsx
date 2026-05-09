import { Link, useLocation } from 'react-router-dom';
import { Menu, User, ShoppingBag, Hotel, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 glass dark:dark-glass border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ManiStayBite Logo" className="h-10 w-10 object-contain drop-shadow-md" />
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">
                ManiStayBite
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/') ? 'text-primary-500' : ''}`}>Home</Link>
            <Link to="/order" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/order') ? 'text-primary-500' : ''}`}>Order Food</Link>
            <Link to="/ai-planner" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/ai-planner') ? 'text-primary-500 font-bold' : ''}`}>✨ AI Planner</Link>
            {isAuthenticated && (
              <>
                <Link to="/rooms" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/rooms') ? 'text-primary-500' : ''}`}>Rooms</Link>
                <Link to="/events" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/events') ? 'text-primary-500' : ''}`}>Events</Link>
                <Link to="/services" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/services') ? 'text-primary-500' : ''}`}>Services</Link>
                <Link to="/community" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/community') ? 'text-primary-500' : ''}`}>Community</Link>
                <Link to="/marketplace" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/marketplace') ? 'text-primary-500' : ''}`}>Marketplace</Link>
                <Link to="/queue" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/queue') ? 'text-primary-500' : ''}`}>Queue</Link>
                <Link to="/dashboard" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/dashboard') ? 'text-primary-500' : ''}`}>Dashboard</Link>
                <Link to="/profile" className={`font-medium transition-colors hover:text-primary-500 ${isActive('/profile') ? 'text-primary-500' : ''}`}>Profile</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login"
                  className="font-medium hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/25"
                >
                  <User className="h-4 w-4" />
                  <span>Signup</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass dark:dark-glass absolute top-16 left-0 w-full p-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/order" onClick={() => setIsMenuOpen(false)}>Order Food</Link>
          <Link to="/ai-planner" onClick={() => setIsMenuOpen(false)} className="text-primary-500 font-bold">✨ AI Planner</Link>
          {isAuthenticated && (
            <>
              <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>Rooms</Link>
              <Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link>
              <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
              <Link to="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
              <Link to="/marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
              <Link to="/queue" onClick={() => setIsMenuOpen(false)}>Queue</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={() => {setIsAuthenticated(false); setIsMenuOpen(false)}} className="text-left text-red-500">Logout</button>
            </>
          )}
          {!isAuthenticated && (
            <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="font-bold">Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-primary-500 font-bold">Create Account</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
