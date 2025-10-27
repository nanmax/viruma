import { useEffect, useRef } from 'react';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

export const useGlobalSocket = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const isInitialized = useRef(false);
  const socketConnected = useRef(false);

  useEffect(() => {
    if (user && !socketConnected.current) {
      socketService.connect();
      socketConnected.current = true;
      isInitialized.current = true;

      socketService.on('article-notification', (data) => {
        if(data.userId !== user.id) {
          showNotification(
            `New article: "${data.title}" by ${data.author}`,
            'info'
          );
        }
        
        window.dispatchEvent(new CustomEvent('article-refresh', { detail: data }));
      });

      socketService.on('connect', () => {
        socketConnected.current = true;
      });

      socketService.on('disconnect', () => {
        socketConnected.current = false;
      });
    }

    if (!user && socketConnected.current) {
      socketService.off('article-notification');
      socketService.off('connect');
      socketService.off('disconnect');
      socketService.disconnect();
      socketConnected.current = false;
      isInitialized.current = false;
    }

    return () => {
    };
  }, [user, showNotification]);

  const emit = (event: string, data: any) => {
    if (socketConnected.current) {
      socketService.emit(event, data);
    }
  };

  const isConnected = () => {
    return socketConnected.current;
  };

  return {
    emit,
    isConnected,
    socketService
  };
};