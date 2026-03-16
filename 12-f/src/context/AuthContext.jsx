import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const ObjectToken = window.localStorage.getItem('ecommerce_token');
  const [token, setToken] = useState(() => ObjectToken);
  const [user, setUser] = useState(() => {
    if (ObjectToken) {
      try { return jwtDecode(ObjectToken) } catch (e) { return null }
    }
    return null;
  });

  // Sincroniza el contexto si el localStorage cambia
  useEffect(() => {
    const storedToken = window.localStorage.getItem('ecommerce_token');
    setToken(storedToken);
    if(storedToken) {
         try {
             setUser(jwtDecode(storedToken));
         } catch (error) {
             setUser(null);
         }
    } else {
        setUser(null)
    }
  }, []);

  const login = (newToken) => {
    window.localStorage.setItem('ecommerce_token', newToken);
    setToken(newToken);
    try {
        setUser(jwtDecode(newToken));
    } catch (error) {
        setUser(null);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('ecommerce_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token; // boolean rapido true/false

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
