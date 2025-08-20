import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPortal from './Components/Auth/MainPortal';
import AdminLogin from './Components/Admin/Admin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import User from './Components/User/UserLogin';
import UserDashboard from './Components/User/User';
import UserSignup from './Components/User/UserSignup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortal />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/mainportal" element={<MainPortal />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;