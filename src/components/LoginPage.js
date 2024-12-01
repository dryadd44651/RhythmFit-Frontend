import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";


const LoginPage = ({ setUsername }) => {
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  localStorage.removeItem('username');
  localStorage.removeItem('guestMode');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 清空之前的錯誤消息

    try {
      const response = await axios.post(`${API_BASE_URL}:8000/api/token/`, {
        username: username,
        password: password,
      });

      // 保存 token 到 localStorage
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("username", username);

      // 設置全局 username 狀態
      setUsername(username);

      // 跳轉到主頁面或其他受保護的頁面
      navigate("/Profile");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleGuestLogin = () => {
    // 不需要 token，直接进入访客模式
    localStorage.setItem("guestMode", "true");
    setUsername("Guest");
    navigate("/Profile");
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <button onClick={handleGuestLogin} style={styles.guestButton}>
        Log in as Guest
      </button>
      <button onClick={navigateToRegister} style={styles.registerButton}>
        Register
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  guestButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#888",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  registerButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default LoginPage;
