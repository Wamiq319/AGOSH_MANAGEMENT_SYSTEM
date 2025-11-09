import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";

const Navbar = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <h1 className="text-2xl font-bold text-gray-800">
              AGOSH_CARE_CENTER
            </h1>
          </Link>
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
              <Button color="orange" variant="filled" rounded>
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button color="orange" variant="filled" rounded>
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile login button */}
        <div className="md:hidden">
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
              <Button color="orange" variant="filled" rounded>
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button color="orange" variant="filled" rounded>
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
