import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchResources,
  fetchResourceById,
} from "@/redux/slices/resourcesSLice";

import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  CreditCard,
  Package,
  Target,
} from "lucide-react";

// GET branchId from LS
const getBranchIdFromLocalStorage = () => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.branch;
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return null;
};

const BranchAdminDashboard = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalDonations: 0,
    generalDonations: 0,
    specificDonations: 0,
    monthlyDonations: [],
  });

  const [localBranchId] = useState(getBranchIdFromLocalStorage());

  useEffect(() => {
    if (!localBranchId) {
      setLoading(false);
      return;
    }
    loadDashboard(localBranchId);
  }, [localBranchId]);

  const generateMonthlyDonationsData = (donations) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyTotals = Array(12).fill(0);
    donations.forEach((d) => {
      const date = new Date(d.createdAt);
      if (!isNaN(date)) {
        const index = date.getMonth();
        monthlyTotals[index] += d.amount || 0;
      }
    });
    return months.map((m, i) => ({
      month: m,
      totalDonations: monthlyTotals[i],
    }));
  };

  const loadDashboard = async (branchId) => {
    setLoading(true);
    const donationResult = await dispatch(
      fetchResourceById({ resource: "donations/branch", id: branchId })
    );
    const donations = donationResult?.payload?.data || [];

    const studentResult = await dispatch(
      fetchResources({ resource: "students" })
    );
    const allStudents = studentResult?.payload?.data || [];

    const students = allStudents.filter((s) => s.branchId === branchId);

    const general = donations.filter((d) => d.category === "GENERAL");
    const specific = donations.filter((d) => d.category === "SPECIFIC_STUDENT");

    const total = donations.reduce((s, d) => s + (d.amount || 0), 0);
    const monthly = generateMonthlyDonationsData(donations);

    setDashboardData({
      totalStudents: students.length,
      totalDonations: total,
      generalDonations: general.reduce((s, d) => s + (d.amount || 0), 0),
      specificDonations: specific.reduce((s, d) => s + (d.amount || 0), 0),
      monthlyDonations: monthly,
    });

    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading dashboard...
      </div>
    );

  const formatCurrency = (num) => {
    if (num >= 1_000_000_000) return `Rs ${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `Rs ${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `Rs ${(num / 1_000).toFixed(1)}k`;
    return `Rs ${num}`;
  };

  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents,
      color: "from-indigo-500 to-indigo-700",
      icon: <Users size={28} />,
    },
    {
      title: "Total Donations",
      value: dashboardData.totalDonations,
      color: "from-green-500 to-green-700",
      icon: <CreditCard size={28} />,
    },
    {
      title: "General Donations",
      value: dashboardData.generalDonations,
      color: "from-yellow-400 to-yellow-600",
      icon: <Package size={28} />,
    },
    {
      title: "Specific Donations",
      value: dashboardData.specificDonations,
      color: "from-red-500 to-red-700",
      icon: <Target size={28} />,
    },
  ];
  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        Branch Admin Dashboard
      </h1>

      {/* ======= Scrollable Gradient Cards ======= */}
      <div className="relative mb-10 flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() =>
            document
              .getElementById("stats-scroll")
              .scrollBy({ left: -300, behavior: "smooth" })
          }
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10
            bg-white text-gray-700 hover:bg-gray-700 hover:text-white
            rounded-full p-2 shadow-lg transition-all duration-300"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Scrollable Cards */}
        <div
          id="stats-scroll"
          className="overflow-x-auto hide-scrollbar scroll-smooth w-full"
        >
          <div className="flex gap-5 px-6 justify-center min-w-max">
            {stats.map((item) => (
              <div
                key={item.title}
                className={`flex-shrink-0 w-64 h-64 relative rounded-2xl bg-gradient-to-br ${item.color}
                  shadow-lg text-white p-6 flex flex-col justify-between
                  transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="uppercase tracking-wide opacity-90 font-semibold">
                    {item.title}
                  </h2>
                  <div className="bg-white/20 p-3 rounded-xl text-lg">
                    {item.icon}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center flex-1">
                  <p className="text-5xl font-extrabold ">
                    {item.title.includes("Students")
                      ? item.value
                      : formatCurrency(item.value)}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() =>
            document
              .getElementById("stats-scroll")
              .scrollBy({ left: 300, behavior: "smooth" })
          }
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10
            bg-white text-gray-700 hover:bg-gray-700 hover:text-white
            rounded-full p-2 shadow-lg transition-all duration-300"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* ======= Chart ======= */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Monthly Donation Trends
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData.monthlyDonations}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalDonations"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BranchAdminDashboard;
