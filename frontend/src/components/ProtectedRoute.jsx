import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../services/auth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const valid = await verifyToken();
      setAuthenticated(valid);
      setChecking(false);
    })();
  }, []);

  if (checking) return <div className="pt-24"><LoadingSpinner message="Memverifikasi akses..." /></div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}
