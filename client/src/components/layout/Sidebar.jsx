import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, X, LogOut } from "lucide-react";
import { SidebarMenus } from "@/Data";
import { Button } from "@/components";
import Logo from "@/assets/LOGO.png";

const Sidebar = ({ role }) => {
  const menus = SidebarMenus[role] || [];
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[9999] p-2 w-12 h-12 flex items-center justify-center 
        bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-orange-200 shadow-xl p-5 flex flex-col 
        transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-2 text-orange-600"
          >
            <div className="bg-white shadow-md rounded-2xl p-3 w-24 h-24 flex items-center justify-center border border-orange-100">
              <img
                src={Logo}
                alt="Agosh Logo"
                className="object-contain w-16 h-16"
              />
            </div>
            <span className="font-extrabold text-lg tracking-wide mt-3">
              Agosh Care
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {menus.map(({ label, Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive && window.location.pathname === path
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              {Icon && <Icon className="w-5 h-5" />}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto border-t border-orange-100 pt-4">
          <Button
            onClick={handleLogout}
            variant="filled"
            color="orange"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 rounded-lg py-2 shadow-md transition"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
