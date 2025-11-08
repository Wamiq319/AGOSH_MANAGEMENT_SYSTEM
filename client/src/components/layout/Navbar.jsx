import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/LOGO.png";
import { Button } from "../ui";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={Logo} alt="Scholarship Zone" className="h-10" />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-gray-700 hover:text-blue-700 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Login Button */}
        <div className="hidden md:block">
          {storedUser ? (
            <Link
              to={`/${
                storedUser.role === "ADMIN"
                  ? "admin"
                  : storedUser.role === "COMMITTEE"
                  ? "committee"
                  : "student"
              }`}
            >
              <Button color="gold" variant="filled" rounded>
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button color="blue" variant="filled" rounded>
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-6 pb-6 border-t border-gray-100">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login">
              <Button color="blue" variant="filled" rounded>
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
