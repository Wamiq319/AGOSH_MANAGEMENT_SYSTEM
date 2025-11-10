import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  AdminDashboard,
  AdminLayout,
  BranchesManagementPage,
} from "@/pages";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route
            path="/branch_management"
            element={<BranchesManagementPage />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
