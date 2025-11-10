import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  AdminDashboard,
  HeadAdminLayout,
  BranchesManagementPage,
  BranchAdminDashboard,
  BranchAdminLayout,
  DonorDashboard,
  DonorAdminLayout,
} from "@/pages";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Website Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<HeadAdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="branches" element={<BranchesManagementPage />} />
        </Route>

        {/* Branch Admin Routes */}
        <Route path="/branch-admin" element={<BranchAdminLayout />}>
          <Route index element={<BranchAdminDashboard />} />
        </Route>

        {/* Donor Routes */}
        <Route path="/donor" element={<DonorAdminLayout />}>
          <Route index element={<DonorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
