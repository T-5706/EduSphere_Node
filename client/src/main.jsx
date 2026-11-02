
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Todo from './pages/Todo';
import Timer from './pages/Timer';

import './styles.css';

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes
      location={location}
      key={location.pathname}
    >
      <Route
        path="/login"
        element={<Auth mode="login" />}
      />

      <Route
        path="/register"
        element={<Auth mode="register" />}
      />

      {/* Timer page without sidebar */}
      <Route
        path="/timer"
        element={
          <ProtectedRoute>
            <Timer />
          </ProtectedRoute>
        }
      />

      {/* Other protected pages with sidebar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="todo"
          element={<Todo />}
        />
      </Route>

      <Route
        path="*"
        element={<Auth mode="login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
