import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components";

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role || "HEAD_OFFICE_ADMIN"} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
