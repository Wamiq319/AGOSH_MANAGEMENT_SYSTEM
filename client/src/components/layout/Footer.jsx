import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-yellow-400">
              Scholarship Zone
            </h3>
            <p className="mt-3 text-gray-300 text-sm leading-relaxed">
              A centralized digital platform to apply, manage, and track
              scholarships with{" "}
              <span className="font-semibold">transparency</span> and{" "}
              <span className="font-semibold">ease</span>.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/scholarships"
                  className="hover:text-yellow-400 transition"
                >
                  Scholarships
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">
              Contact
            </h4>
            <p className="text-gray-300 text-sm">support@scholarshipzone.com</p>
            <p className="text-gray-300 text-sm">+92 300 1234567</p>
            <p className="text-gray-300 text-sm">Islamabad, Pakistan</p>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="hover:text-yellow-400 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-blue-800 pt-4 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-yellow-400 font-semibold">
              Scholarship Zone
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
