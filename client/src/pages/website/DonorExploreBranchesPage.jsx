import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources } from "@/redux/slices/resourcesSLice";
import { useNavigate } from "react-router-dom";

import { Card, Navbar, Footer } from "@/components";

import {
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
  FaArrowRight,
  FaHandHoldingHeart,
} from "react-icons/fa";

const ICONS = {
  MapPin: <FaMapMarkerAlt className="text-red-500" />,
  Phone: <FaPhone className="text-green-600" />,
  Building: <FaBuilding />,
  ArrowRight: <FaArrowRight size={14} />,
  Donate: <FaHandHoldingHeart />,
};

const BRANCH_FIELDS = [
  {
    key: "location",
    label: "Location",
    icon: "MapPin",
  },
  {
    key: "phoneNumber",
    label: "Contact",
    icon: "Phone",
  },
];

const getBranchActions = (navigate, branch) => [
  {
    type: "button",
    label: "Explore",
    onClick: () => navigate(`/branch/${branch._id}`),
  },
  {
    type: "button",
    label: "Donate",
    onClick: () =>
      navigate("/donate", {
        state: { branchId: branch._id, branchName: branch.name },
      }),
  },
];

// --- Main Component ---

const DonorExploreBranchesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status } = useSelector((state) => state.resources);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchResources({ resource: "branches" }));
  }, [dispatch]);

  const filteredBranches = data.branches?.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Our Care Centers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our branches across different locations. You can choose to
            support a specific branch directly or sponsor a child registered
            under them.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search branch by name or location..."
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Grid Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches?.map((branch) => (
            <Card
              key={branch._id}
              item={{
                ...branch,
                title: branch.name,
                status: "active",
              }}
              headerIcon={ICONS.Building}
              fields={BRANCH_FIELDS.map((f) => ({
                ...f,
                icon: ICONS[f.icon], // <-- Convert string icon to real component
              }))}
              actions={getBranchActions(navigate, branch).map((action) => ({
                ...action,
                icon:
                  action.label === "Explore" ? ICONS.ArrowRight : ICONS.Donate,
              }))}
            />
          ))}
        </div>

        {/* Empty State */}
        {status !== "loading" && filteredBranches?.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No branches found matching your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DonorExploreBranchesPage;
