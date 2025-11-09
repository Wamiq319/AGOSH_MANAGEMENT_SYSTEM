import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
import Logo from "../../assets/LOGO.png";

const Navbar = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={Logo} alt="Scholarship Zone" className="h-20" />
          </Link>
        </div>
        {/* Desktop Login Button */}
        <div className="hidden md:block">
          {storedUser ? (
            <Link
              to={`/${
                storedUser.role === "HEAD_OFFICE_ADMIN"
                  ? "admin_dashboard"
                  : storedUser.role === "BRANCH_ADMIN"
                  ? "branch_admin_dashboard"
                  : "donor"
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
                storedUser.role === "HEAD_OFFICE_ADMIN"
                  ? "admin_dashboard"
                  : storedUser.role === "BRANCH_ADMIN"
                  ? "branch_admin_dashboard"
                  : "donor"
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
