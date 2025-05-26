import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Dashboard from './pages/Dashboard';
import Reminder from './pages/MyTasks';
import MyDiary from './pages/MyDiary';
import Login from './loginsigup/login';
import Signup from './loginsigup/signup';
import './index.css';

function App() {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await axios.get('http://localhost:5000/api/auth/verify-token', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setIsTokenValid(true);
      } catch (error) {
        localStorage.removeItem('token');
        setIsTokenValid(false);
        if (!isAuthPage) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, isAuthPage, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Optionally use a spinner here
  }

  return (
    <Routes>
      {/* Auth Pages */}
      <Route
        path="/login"
        element={!isTokenValid ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!isTokenValid ? <Signup /> : <Navigate to="/" />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={isTokenValid ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/tasks"
        element={isTokenValid ? <Reminder /> : <Navigate to="/login" />}
      />
      <Route
        path="/diary"
        element={isTokenValid ? <MyDiary /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
