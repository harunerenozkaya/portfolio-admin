import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get('/login');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;