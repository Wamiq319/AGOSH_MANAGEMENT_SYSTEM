import React, { useEffect, useState } from "react";
import { Users, DollarSign } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

export const BranchAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user._id) {
          setError("Authentication error: No user found.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/dashboard/branch-admin`, {
          headers: { "x-user-id": user._id },
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch data");
        }

        setDashboardData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-orange-600 font-medium">
          Loading dashboard...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
        Failed to load data: {error}. Please try again.
      </div>
    );

  const stats = [
    {
      title: "Total Students",
      value: dashboardData?.totalStudents || 0,
      icon: <Users className="w-10 h-10" />,
      gradient: "from-orange-400 to-orange-600",
    },
    {
      title: "Total Donations",
      value: `$${(dashboardData?.totalDonations || 0).toLocaleString()}`,
      icon: <DollarSign className="w-10 h-10" />,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-orange-600 drop-shadow-sm">
        Branch Admin Dashboard
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`w-72 h-72 bg-gradient-to-br ${stat.gradient} 
              text-white rounded-3xl shadow-lg p-8 flex flex-col justify-between
              transform transition duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="flex justify-between items-center">
              <h2 className="uppercase tracking-wide font-semibold text-white/90">
                {stat.title}
              </h2>
              <div className="bg-white/20 p-3 rounded-2xl">{stat.icon}</div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-6xl font-extrabold">{stat.value}</p>
            </div>

            <div className="h-1 bg-white/30 rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500">
          More insights coming soon — donations and student trends will appear
          here once available.
        </p>
      </div>
    </div>
  );
};
