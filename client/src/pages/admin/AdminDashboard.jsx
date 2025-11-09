import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  Building,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui";

const API_URL = import.meta.env.VITE_API_URL || "";

export const AdminDashboard = () => {
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

        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            "x-user-id": user._id,
          },
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
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load data: {error}. Please try again.
      </div>
    );

  const stats = [
    {
      title: "Total Students",
      value: dashboardData?.totalStudents,
      color: "from-blue-500 to-indigo-500",
      icon: <GraduationCap className="w-8 h-8" />,
    },
    {
      title: "Total Users",
      value: dashboardData?.totalUsers,
      color: "from-purple-500 to-pink-500",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Total Branches",
      value: dashboardData?.totalBranches,
      color: "from-green-400 to-emerald-500",
      icon: <Building className="w-8 h-8" />,
    },
    {
      title: "Total Donations",
      value: `$${dashboardData?.totalDonations?.toLocaleString()}`,
      color: "from-yellow-400 to-orange-500",
      icon: <DollarSign className="w-8 h-8" />,
    },
  ];

  const monthlyData = [
    { month: "Jan", students: 0 },
    { month: "Feb", students: 0 },
    { month: "Mar", students: 0 },
    { month: "Apr", students: 0 },
    { month: "May", students: 0 },
    { month: "Jun", students: 0 },
    { month: "Jul", students: 0 },
    { month: "Aug", students: 0 },
    { month: "Sep", students: 0 },
    { month: "Oct", students: 0 },
    { month: "Nov", students: 0 },
    { month: "Dec", students: 0 },
  ];

  dashboardData?.recentStudents?.forEach((student) => {
    const monthIndex = new Date(student.createdAt).getMonth();
    monthlyData[monthIndex].students += 1;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Admin Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="relative mb-10 flex items-center">
        <button
          onClick={() =>
            document
              .getElementById("stats-scroll")
              .scrollBy({ left: -300, behavior: "smooth" })
          }
          className="absolute -left-8 md:-left-10 top-1/2 -translate-y-1/2 z-10
    bg-white text-yellow-500 hover:bg-yellow-500 hover:text-white
    rounded-full p-2 shadow-lg transition-all duration-300"
        >
          <ChevronLeft size={28} />
        </button>

        <div
          id="stats-scroll"
          className="overflow-x-auto hide-scrollbar scroll-smooth w-full"
        >
          <div className="flex gap-5 px-6 min-w-max">
            {stats.map((item) => (
              <div
                key={item.title}
                className={`flex-shrink-0 w-64 h-64 relative rounded-2xl bg-gradient-to-br ${item.color}
          shadow-md text-white p-6 flex flex-col justify-between
          transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="uppercase tracking-wide opacity-90 font-semibold">
                    {item.title}
                  </h2>
                  <div className="bg-white/20 p-3 rounded-xl">{item.icon}</div>
                </div>
                <div className="flex flex-col justify-center items-center flex-1">
                  <p className="text-5xl font-extrabold drop-shadow-lg">
                    {item.value}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            document
              .getElementById("stats-scroll")
              .scrollBy({ left: 300, behavior: "smooth" })
          }
          className="absolute -right-8 md:-right-10 top-1/2 -translate-y-1/2 z-10
    bg-white text-yellow-500 hover:bg-yellow-500 hover:text-white
    rounded-full p-2 shadow-lg transition-all duration-300"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly New Student Trends */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Monthly New Student Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: "10px" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Students
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Name</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentStudents?.map((student) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.branch?.name || "N/A"}</td>
                    <td className="p-3">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Donations
          </h2>
          <div className="space-y-4">
            {dashboardData?.recentDonations?.map((donation) => (
              <div
                key={donation._id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-semibold">
                    {donation.donor?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {donation.branch?.name || "N/A"}
                  </p>
                </div>
                <p className="font-bold text-green-600">
                  ${donation.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
