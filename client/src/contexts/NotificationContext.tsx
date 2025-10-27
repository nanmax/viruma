import React, { createContext, useContext, ReactNode } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { NotificationContextType } from '../types';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    toast[type](message);
  };

  const value: NotificationContextType = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </NotificationContext.Provider>
  );
};
