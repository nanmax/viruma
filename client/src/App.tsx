import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useGlobalSocket } from './contexts/useGlobalSocket';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import ArticleList from './components/ArticleList';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './pages/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

const AuthRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <Auth />;
};

const AppContent: React.FC = () => {
  useGlobalSocket();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthRedirect />} />
          
          <Route 
            path="/articles" 
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </CustomThemeProvider>
  );
};

export default App;
