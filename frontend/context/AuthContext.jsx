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
                    const userData = await userService.getAccount();
                    setUser(userData.data);
                } catch (error) {
                    console.error('Lỗi lấy thông tin user:', error);
                    localStorage.removeItem('authToken');
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
            const userData = await userService.getAccount();
            setUser(userData.data);
            return userData.data;
        } catch (error) {
            console.error('Lỗi lấy thông tin user:', error);
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
