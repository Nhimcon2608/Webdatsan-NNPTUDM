import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import AdminLayout from '../layouts/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage/DashboardPage';
import PartnershipRequestPage from '../pages/admin/PartnershipRequestPage/PartnershipRequestPage';
import BranchesPage from '../pages/admin/BranchesPage/BranchesPage';
import BranchDetailPage from '../pages/admin/BranchDetailPage/BranchDetailPage'
import AccountsPage from '../pages/admin/AccountsPage/AccountsPage'
import MyAccountPage from '../pages/admin/MyAccountPage/MyAccountPage';


const AdminRoutes = (
    <Route
        path="/admin"
        element={
            <ProtectedRoute>
                <RoleBasedRoute role="ADMIN">
                    <AdminLayout />
                </RoleBasedRoute>
            </ProtectedRoute>
        }
    >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="partnership-request" element={<PartnershipRequestPage />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="branches/:branchId" element={<BranchDetailPage />} />
        <Route path='accounts' element={<AccountsPage />} />
        <Route path="my-account" element={<MyAccountPage />} />
    </Route>
);

export default AdminRoutes;
