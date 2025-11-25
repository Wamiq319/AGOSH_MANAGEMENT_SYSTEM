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

        const response = await fetch(`${API_URL}/api/dashboard/admin`, {
          headers: { "x-user-id": user._id },
        });

        const result = await response.json();
        if (!result.success)
          throw new Error(result.message || "Failed to fetch data");
        setDashboardData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-blue-600">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span className="text-lg font-medium">Loading dashboard...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        Failed to load data: {error}
      </div>
    );
// Currency formatter
const formatCurrency = (num) => {
  if (num >= 1_000_000_000) return `Rs ${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `Rs ${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `Rs ${(num / 1_000).toFixed(1)}k`;
  return `Rs ${num}`;
};

const stats = [
  {
    title: "Total Students",
    value: dashboardData?.totalStudents || 0,
    color: "from-blue-500 to-blue-700",
    icon: <GraduationCap className="w-8 h-8" />,
  },
  {
    title: "Total Users",
    value: dashboardData?.totalUsers || 0,
    color: "from-orange-500 to-orange-700",
    icon: <Users className="w-8 h-8" />,
  },
  {
    title: "Total Branches",
    value: dashboardData?.totalBranches || 0,
    color: "from-blue-400 to-orange-400",
    icon: <Building className="w-8 h-8" />,
  },
  {
    title: "Total Donations",
    value: formatCurrency(dashboardData?.totalDonations || 0),
    color: "from-orange-400 to-blue-500",
    icon: <DollarSign className="w-8 h-8" />,
  },
];

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    students: 0,
  }));

  dashboardData?.recentStudents?.forEach((student) => {
    const monthIndex = new Date(student.createdAt).getMonth();
    monthlyData[monthIndex].students += 1;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
        Agosh Care Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="relative mb-10 flex items-center">
        <button
          onClick={() =>
            document
              .getElementById("stats-scroll")
              .scrollBy({ left: -300, behavior: "smooth" })
          }
          className="absolute -left-8 md:-left-10 top-1/2 -translate-y-1/2 z-10 bg-white 
          text-orange-500 hover:bg-orange-500 hover:text-white rounded-full p-2 shadow-md transition-all"
        >
          <ChevronLeft size={26} />
        </button>

        <div
          id="stats-scroll"
          className="overflow-x-auto hide-scrollbar scroll-smooth w-full"
        >
          <div className="flex gap-6 px-6 min-w-max">
            {stats.map((item) => (
              <div
                key={item.title}
                className={`flex-shrink-0 w-64 h-64 relative rounded-2xl 
                bg-gradient-to-br ${item.color} text-white shadow-lg p-6 
                flex flex-col justify-between transition-transform hover:scale-105`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="uppercase tracking-wide text-sm opacity-90 font-semibold">
                    {item.title}
                  </h2>
                  <div className="bg-white/25 p-3 rounded-xl">{item.icon}</div>
                </div>
                <div className="flex flex-col items-center justify-center flex-1">
                  <p className="text-5xl font-extrabold">{item.value}</p>
                </div>
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
          className="absolute -right-8 md:-right-10 top-1/2 -translate-y-1/2 z-10 bg-white 
          text-orange-500 hover:bg-orange-500 hover:text-white rounded-full p-2 shadow-md transition-all"
        >
          <ChevronRight size={26} />
        </button>
      </div>

      {/* Charts & Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-6 border-t-4 border-orange-500">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Monthly New Student Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip contentStyle={{ borderRadius: "10px" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ r: 5, fill: "#2563EB" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Recent Students
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-50 text-blue-700">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Branch</th>
                  <th className="p-3 font-semibold">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentStudents?.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-orange-50 transition-all"
                  >
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
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border-t-4 border-orange-500">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">
            Recent Donations
          </h2>
          <div className="space-y-4">
            {dashboardData?.recentDonations?.map((donation) => (
              <div
                key={donation._id}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all"
              >
                <div>
                  <p className="font-semibold text-blue-700">
                    {donation.donor?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {donation.branch?.name || "N/A"}
                  </p>
                </div>
                <p className="font-bold text-orange-600">
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
