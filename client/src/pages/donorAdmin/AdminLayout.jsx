import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Navbar } from "@/components";

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role || "DONOR"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
