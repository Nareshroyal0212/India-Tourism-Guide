import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Places from './pages/Places';
import ChatBot from './pages/ChatBot';
import Budget from './pages/Budget';
import Weather from './pages/Weather';
import Recommend from './pages/Recommend';
import Distance from './pages/Distance';
import Nearby from './pages/Nearby';
import MyVisited from './pages/MyVisited';
import Badges from './pages/Badges';
import Festivals from './pages/Festivals';
import ImageRecognition from './pages/ImageRecognition';
import GroupTrip from './pages/GroupTrip';
import Restaurants from './pages/Restaurants';
import FuelStations from './pages/FuelStations';
import TollPlaza from './pages/TollPlaza';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import './index.css';

// Guards every feature page behind a logged-in user session. If there's no
// token, the visitor is redirected to /login. Home, Login, Register, and
// the Admin flow are intentionally NOT wrapped in this - they stay open.
function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Please login or register to continue exploring.' }}
      />
    );
  }
  return children;
}

function App() {
  const path = window.location.pathname;
  const hideNav = path.startsWith('/admin') ||
                  path === '/login' ||
                  path === '/register' ||
                  path === '/forgot-password' ||
                  path.startsWith('/reset-password');
  return (
    <Router>
      {!hideNav && <Navbar />}
      <Routes>
        {/* Open to everyone - no login required */}
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin - separate login flow, untouched by user auth gating */}
        <Route path="/admin/login"     element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/panel"     element={<AdminPanel />} />

        {/* Everything below requires a logged-in user session */}
        <Route path="/places"          element={<RequireAuth><Places /></RequireAuth>} />
        <Route path="/chat"            element={<RequireAuth><ChatBot /></RequireAuth>} />
        <Route path="/budget"          element={<RequireAuth><Budget /></RequireAuth>} />
        <Route path="/weather"         element={<RequireAuth><Weather /></RequireAuth>} />
        <Route path="/recommend"       element={<RequireAuth><Recommend /></RequireAuth>} />
        <Route path="/distance"        element={<RequireAuth><Distance /></RequireAuth>} />
        <Route path="/nearby"          element={<RequireAuth><Nearby /></RequireAuth>} />
        <Route path="/my-visited"      element={<RequireAuth><MyVisited /></RequireAuth>} />
        <Route path="/badges"          element={<RequireAuth><Badges /></RequireAuth>} />
        <Route path="/festivals"       element={<RequireAuth><Festivals /></RequireAuth>} />
        <Route path="/image-recognition" element={<RequireAuth><ImageRecognition /></RequireAuth>} />
        <Route path="/group-trip"      element={<RequireAuth><GroupTrip /></RequireAuth>} />
        <Route path="/restaurants"     element={<RequireAuth><Restaurants /></RequireAuth>} />
        <Route path="/fuel-stations"   element={<RequireAuth><FuelStations /></RequireAuth>} />
        <Route path="/toll-plaza"      element={<RequireAuth><TollPlaza /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;