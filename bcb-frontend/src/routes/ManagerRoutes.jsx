import React from "react";
import { Route } from "react-router-dom";

import ProtectedRoute from "../components/routes/ProtectedRoute";
import RoleBasedRoute from "../components/routes/RoleBasedRoute";

import ManagerLayout from "../layouts/manager/ManagerLayout";
import Courts from "../pages/manager/Courts/Courts";
import DashboardPage from "../pages/manager/DashboardPage";
import Reservations from "../pages/manager/Reservations/Reservation";
import Vouchers from "../pages/manager/Vouchers/Voucher";
import PaymentInvoice from "../pages/manager/PaymentInvoices/PaymentInvoice";
import AccountManager from "../pages/manager/AccountManagers/AccountManager";
import Branch from "../pages/manager/Branchs/Branch";

const ManagerRoutes = (
  <Route
    path="/manager"
    element={
      <ProtectedRoute>
        <RoleBasedRoute role="MANAGER">
          <ManagerLayout />
        </RoleBasedRoute>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="courts" element={<Courts />} />
    <Route path="bookings" element={<Reservations />} />
    <Route path="vouchers" element={<Vouchers />} />
    <Route path="invoices" element={<PaymentInvoice />} />
    <Route path="account" element={<AccountManager />} />
    <Route path="branchs" element={<Branch />} />
  </Route>
);

export default ManagerRoutes;
