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
  StudentManagementPage,
  DonorRegistrationPage,
  DonationManagementPage,
} from "@/pages";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Website Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-donor" element={<DonorRegistrationPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<HeadAdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="branches" element={<BranchesManagementPage />} />
        </Route>

        {/* Branch Admin Routes */}
        <Route path="/branch-admin" element={<BranchAdminLayout />}>
          <Route index element={<BranchAdminDashboard />} />

          <Route path="students" element={<StudentManagementPage />} />
        </Route>

        {/* Donor Routes */}
        <Route path="/donor" element={<DonorAdminLayout />}>
          <Route index element={<DonorDashboard />} />
          <Route path="donations" index element={<DonationManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
