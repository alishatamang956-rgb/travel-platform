import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, role, token }

  // Restore session from localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username) {
      setUser({ token, username, role });
    }
  }, []);

  async function login(username, password) {
    const data = await loginRequest(username, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setUser({ token: data.token, username: data.username, role: data.role });
    return data;
  }

  async function register(username, email, password) {
    const data = await registerRequest(username, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setUser({ token: data.token, username: data.username, role: data.role });
    return data;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
