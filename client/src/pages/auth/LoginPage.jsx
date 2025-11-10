import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/redux/slices/resourcesSLice";
import { Navbar, Footer } from "@/components";
import logo from "@/assets/LOGO.png";
import { Button, InputField } from "@/components";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.resources);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const role = result.payload.data.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "BRANCH_ADMIN") navigate("/branch-admin");
      else if (role === "DONOR") navigate("/donor");
      else navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex items-center justify-center flex-1 bg-blue-50">
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Column */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-orange-500 items-center justify-center flex-col p-12 rounded-l-2xl text-white">
            <div className="bg-white rounded-full p-4 shadow-md mb-6">
              <img
                src={logo}
                alt="Agosh Care Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-center">
              Welcome to Agosh Care
            </h1>
            <p className="text-center leading-relaxed max-w-xs">
              Log in to your management dashboard to manage users, view reports,
              and keep track of all operations efficiently.
            </p>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
              Admin / Staff Login
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField
                label="Email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                color="blue"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                color="blue"
              />

              <Button
                type="submit"
                color="orange"
                variant="filled"
                rounded
                className="w-full py-3 text-lg"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Logging in..." : "Login"}
              </Button>

              {error && (
                <p className="mt-2 text-sm text-orange-600 font-medium">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
