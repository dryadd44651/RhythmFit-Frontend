import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from "../AppContext";
// import { auth } from './storage';

const PrivateRoute = ({ element }) => {
  const {
    auth,
  } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    console.log("Private route effect");
    async function checkAuth() {
      const result = await auth();
      setIsAuthenticated(result);
    }
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // 可自定義 Loading UI
  } else if (isAuthenticated) {
    console.log("Private route auth", isAuthenticated);
  } else {
    console.log("Private route not auth", isAuthenticated);
    
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
