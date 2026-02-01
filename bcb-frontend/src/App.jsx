import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop'

import { UserRoutes, AdminRoutes, ManagerRoutes } from './routes/index'

import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProgressBar from './components/common/ProgressBar';

import apiClient from './services/api';

function App() {

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    return (
        <BrowserRouter>
            <ProgressBar />
            <ScrollToTop />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                {UserRoutes}
                {AdminRoutes}
                {ManagerRoutes}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
