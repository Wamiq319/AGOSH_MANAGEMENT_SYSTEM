import React, { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

export const DonorDashboard = () => {
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

        const response = await fetch(`${API_URL}/api/dashboard/donor`, {
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
      title: "Total Donations",
      value: `$${dashboardData?.totalDonations?.toLocaleString()}`,
      color: "from-yellow-400 to-orange-500",
      icon: <DollarSign className="w-8 h-8" />,
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Donor Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="flex justify-center mb-10">
        {stats.map((item) => (
          <div
            key={item.title}
            className={`w-64 h-64 relative rounded-2xl bg-gradient-to-br ${item.color}
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

      {/* Recent Donations */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Recent Donations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Branch</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentDonations?.map((donation) => (
                <tr key={donation._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{donation.branch?.name || "N/A"}</td>
                  <td className="p-3">${donation.amount.toLocaleString()}</td>
                  <td className="p-3">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
