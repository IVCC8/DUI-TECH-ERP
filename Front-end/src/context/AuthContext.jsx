/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // role: 'admin' | 'seller' | 'client' | null
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        // Mock Demo Access
        if (email === 'admin' && password === 'admin') {
            setUser({ name: 'Admin Demo', role: 'admin', title: 'Gerente General' });
            return true;
        }
        if (email === 'vendedor' && password === 'vendedor') {
            setUser({ name: 'Vendedor Demo', role: 'seller', title: 'Ventas Mostrador' });
            return true;
        }
        if (email === 'cliente' && password === 'cliente') {
            setUser({ name: 'Cliente Demo', role: 'client', title: 'Usuario Registrado' });
            return true;
        }
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Map backend user to frontend expectations
                const userObj = {
                    ...data.user,
                    name: data.user.username || data.user.name,
                    title: data.user.role === 'admin' ? 'Gerente General' : 
                           data.user.role === 'seller' ? 'Ventas Mostrador' : 'Usuario Registrado'
                };
                setUser(userObj);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login Error:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
