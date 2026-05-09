import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import OrderPage from './pages/OrderPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import HotelOwnerDashboard from './pages/HotelOwnerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Rooms from './pages/Rooms';
import EventBooking from './pages/EventBooking';
import ResortServices from './pages/ResortServices';
import ForgotPassword from './pages/ForgotPassword';
import AIPlanner from './pages/AIPlanner';
import Community from './pages/Community';
import Marketplace from './pages/Marketplace';
import QueueTracker from './pages/QueueTracker';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';
import Notification from './components/Notification';
import GlobalNavbar from './components/GlobalNavbar';
import ChatWidget from './components/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import DigitalConcierge from './components/DigitalConcierge';
import VoiceAssistant from './components/VoiceAssistant';
import SplashScreen from './components/SplashScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // SUPER_ADMIN, HOTEL_OWNER, EMPLOYEE, CUSTOMER
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <GlobalNavbar />
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        <main className="flex-grow pt-24">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
              <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/ai-planner" element={<AIPlanner />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/events" element={<EventBooking />} />
              <Route path="/services" element={<ResortServices />} />
              <Route path="/community" element={<Community />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/queue" element={<QueueTracker />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated ? (
                    userRole === 'SUPER_ADMIN' ? <SuperAdminDashboard /> :
                    userRole === 'HOTEL_OWNER' ? <HotelOwnerDashboard /> :
                    userRole === 'EMPLOYEE' ? <EmployeeDashboard /> :
                    <Dashboard />
                  ) : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/rooms" 
                element={isAuthenticated ? <Rooms /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/events" 
                element={isAuthenticated ? <EventBooking /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/services" 
                element={isAuthenticated ? <ResortServices /> : <Navigate to="/login" replace />} 
              />
            </Routes>
          </ErrorBoundary>
        </main>
        
        <Chatbot />
        <ChatWidget />
        <DigitalConcierge />
        <VoiceAssistant />
        <Notification />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
