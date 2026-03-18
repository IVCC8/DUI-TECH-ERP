/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 'init-1', title: 'Bienvenido al Sistema', text: 'Dui Tech ERP está listo para operar. Revisa tus pendientes hoy.', time: 'Hoy', type: 'system', unread: true },
        { id: 'init-2', title: 'Seguridad', text: 'Recuerda que tu sesión finaliza automáticamente tras inactividad.', time: 'Ayer', type: 'system', unread: false }
    ]);

    const addNotification = useCallback((notif) => {
        const newNotif = {
            id: Date.now(),
            title: notif.title || 'Alerta del Sistema',
            text: notif.text || '',
            time: 'Ahora',
            type: notif.type || 'system', // order, stock, system
            unread: true,
            link: notif.link || null
        };
        setNotifications(prev => [newNotif, ...prev]);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            addNotification, 
            markAsRead, 
            markAllAsRead, 
            removeNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
