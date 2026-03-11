/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        let currentSocket = socket;

        if (!user) {
            if (currentSocket) {
                currentSocket.disconnect();
                // setSocket(null) will cause a warning if run sync.
                // We handle disconnect but rely on local logic for nulling if needed.
            }
            return;
        }

        // Connect to Socket.IO backend
        // Default to localhost:5000 in dev
        const newSocket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');

        newSocket.on('connect', () => {
            console.log('Socket connected');
            newSocket.emit('join', user.id);
        });

        newSocket.on('notification', (notification) => {
            // Unshift new notification
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Native browser notification if granted
            if (Notification.permission === 'granted') {
                new Notification('New Activity', {
                    body: notification.message,
                });
            }
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const markAsRead = () => {
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    const requestPermission = () => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearNotifications, requestPermission }}>
            {children}
        </NotificationContext.Provider>
    );
};
