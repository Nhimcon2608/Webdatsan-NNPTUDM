import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../src/services/userService';
import apiClient from '../src/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchUserAccount = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await userService.getAccount();
                    const account = response?.data?.data ?? null;
                    if (isMounted) {
                        setUser(account);
                    }
                } catch (error) {
                    console.error('Lỗi lấy thông tin user:', error);
                    localStorage.removeItem('authToken');
                    delete apiClient.defaults.headers.common['Authorization'];
                }
            }
            if (isMounted) setLoading(false);

            setLoading(false);
        };
        fetchUserAccount();
        return () => { isMounted = false; };
    }, []);

    const login = async () => {
        try {
            const response = await userService.getAccount();
            const account = response?.data?.data ?? null;
            setUser(account);
            return account;
        } catch (error) {
            console.error('Lỗi lấy thông tin user:', error);
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        delete apiClient.defaults.headers.common['Authorization']; 
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
