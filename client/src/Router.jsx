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
  DonorManagementPage,
  StudentsManagementPage,
  DonorExploreBranchesPage,
  BranchDetailPage,
  DonatePage,
  BranchDonationsPage,
  DonationsManagementPage,
  NeedsReportingPage
} from "@/pages";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Website Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-donor" element={<DonorRegistrationPage />} />
        <Route path="/branches" element={<DonorExploreBranchesPage />} />
        <Route path="/branch/:id" element={<BranchDetailPage />} />
        <Route path="/donate" element={<DonatePage />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<HeadAdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="branches" element={<BranchesManagementPage />} />
          <Route path="donors" element={<DonorManagementPage />} />
          <Route path="donations" element={<DonationsManagementPage />} />
          <Route path="students" element={<StudentsManagementPage />} />
        </Route>

        {/* Branch Admin Routes */}
        <Route path="/branch-admin" element={<BranchAdminLayout />}>
          <Route index element={<BranchAdminDashboard />} />
          <Route path="students" element={<StudentManagementPage />} />
          <Route path="donations" element={<BranchDonationsPage />} />
          <Route path="requests" element={<NeedsReportingPage />} />
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
