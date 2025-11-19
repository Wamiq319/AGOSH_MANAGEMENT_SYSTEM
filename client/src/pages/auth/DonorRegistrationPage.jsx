import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { InputField, Button } from "../../components";
import { registerUser } from "../../redux/slices/resourcesSLice";
import Logo from "@/assets/LOGO.png";
import { Navbar, Footer } from "../../components";
import { FaHandsHelping, FaRegSmile } from "react-icons/fa";

const DonorRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, message } = useSelector((state) => state.resources);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ ...formData, role: "DONOR" }));
  };

  useEffect(() => {
    if (status === "succeeded" && message === "User registered successfully") {
      navigate("/login");
    }
  }, [status, message, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f6fc]">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="flex-grow max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* LEFT SECTION - FORM */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex justify-center mb-4">
              <img src={Logo} className="w-20 h-auto" alt="Agosh Logo" />
            </div>

            <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
              Donor Registration
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <InputField
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                className="w-full"
                color="orange"
                rounded
                disabled={status === "loading"}
              >
                {status === "loading" ? "Registering..." : "Register"}
              </Button>

              {status === "failed" && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </form>

            {/* Already have an account? */}
            <p className="text-center mt-4 text-gray-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

          {/* RIGHT SECTION - INFO / CTA */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-extrabold text-blue-700 leading-tight">
              Your Contribution Changes Students’ Lives
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              Across Pakistan, thousands of students are struggling financially.
              By becoming a donor, you directly support a student’s education,
              helping them build a better future for themselves and their
              families.
            </p>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition">
                <FaHandsHelping className="text-orange-500 text-4xl mb-3" />
                <h3 className="text-xl font-semibold text-blue-700">
                  Trusted Support
                </h3>
                <p className="text-gray-600 mt-1">
                  Donations go directly to verified deserving students.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition">
                <FaRegSmile className="text-orange-500 text-4xl mb-3" />
                <h3 className="text-xl font-semibold text-blue-700">
                  Real Impact
                </h3>
                <p className="text-gray-600 mt-1">
                  A small contribution can help a Pakistani student continue
                  school or university.
                </p>
              </div>
            </div>

            <Button
              rounded
              color="orange"
              className="px-8 py-4 text-lg self-start md:self-center"
              onClick={() => (window.location.href = "/donate")}
            >
              Start Donating Today
            </Button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default DonorRegistrationPage;
