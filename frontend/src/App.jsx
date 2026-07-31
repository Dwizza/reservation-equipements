import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import EquipmentsList from './pages/Equipments/EquipmentsList';
import ReservationsList from './pages/Reservations/ReservationsList';

import AppLayout from './components/layout/AppLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center text-slate-500">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/equipments" element={<ProtectedRoute><EquipmentsList /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><ReservationsList /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
