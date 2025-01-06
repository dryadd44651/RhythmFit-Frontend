import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import TrainingPage from './components/TrainingPage';
import LoginPage from "./components/LoginPage";
import ProfilePage from './components/ProfilePage';
import RegisterPage from "./components/RegisterPage";
import PrivateRoute from './components/PrivateRoute'; // 引入 PrivateRoute
import { AppProvider,useAppContext } from './AppContext'; // 引入 AppProvider

import './App.css';

const App = () => {
  // const [username, setUsername] = useState(null);
  const {
    username,
    setUsername,
  } = useAppContext();

  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="nav-links">
            <a href="/Training" className="nav-link">Training</a>
            <a href="/Profile" className="nav-link">Profile</a>
            {username ? (
              <a href="/Profile" className="nav-link">Hello, {username}</a>
            ) : (
              <a href="/login" className="nav-link">Login</a>
            )}
          </div>
          <LogoutButton setUsername={setUsername} />
        </nav>

        <Routes>
          {/* 用 PrivateRoute 保護需要身份驗證的路由 */}
            <Route
              path="/Training"
              // element={<PrivateRoute element={<AppProvider><TrainingPage /></AppProvider>} username={username} />}
              element={<PrivateRoute element={<TrainingPage />} username={username} />}

            />
            <Route
              path="/Profile"
              // element={<PrivateRoute element={<AppProvider><ProfilePage /></AppProvider>} username={username} />}
              element={<PrivateRoute element={<ProfilePage />} username={username} />}
            />
          <Route path="/login" element={<LoginPage setUsername={setUsername} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<h1>Welcome to the Fitness App</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

// Logout 按鈕組件
const LogoutButton = ({ setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    setUsername(null);
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default App;
