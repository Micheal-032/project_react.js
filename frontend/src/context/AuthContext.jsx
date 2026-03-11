/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    // Verify token validity by fetching profile
                    await api.get('/users/profile');
                } catch {
                    console.error("Token invalid or expired");
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
            const userData = { ...res.data.user, token: res.data.token };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return res.data;
        }
        return res.data;
    };

    const register = async (name, email, password, avatar) => {
        const res = await api.post('/auth/register', { name, email, password, avatar });
        if (res.data.success) {
            const userData = { ...res.data.user, token: res.data.token };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return res.data;
        }
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = async (profileData) => {
        const res = await api.put('/users/profile', profileData);
        if (res.data.success) {
            const updatedUser = { ...user, ...res.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
