import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './storage';

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const result = await auth();
      setIsAuthenticated(result);
    }
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // 可自定義 Loading UI
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
