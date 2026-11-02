import { createContext, useContext, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edusphere_user') || 'null'); }
    catch { return null; }
  });
  async function authenticate(mode, form) {
    const result = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(form) });
    localStorage.setItem('edusphere_token', result.token);
    localStorage.setItem('edusphere_user', JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  }
  function logout() {
    localStorage.removeItem('edusphere_token');
    localStorage.removeItem('edusphere_user');
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, setUser, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
