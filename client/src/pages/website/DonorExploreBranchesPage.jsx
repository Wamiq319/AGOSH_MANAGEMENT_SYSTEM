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
  FaSearch, 
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
      <div className="min-h-screen bg-gray-50">
        
        {/* --- FULL-WIDTH ORANGE HEADER SECTION --- */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 pt-16 pb-40 px-6 shadow-xl">
            <div className="max-w-4xl mx-auto text-center">
                <FaBuilding className="text-white text-5xl mx-auto mb-4" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                    Our Global Care Centers
                </h1>
                <p className="text-orange-100 max-w-2xl mx-auto text-lg mb-6">
                    Explore our branches across different locations. You can choose to
                    support a specific branch directly or sponsor a child registered
                    under them.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-xl mx-auto -mt-24 mb-12">
                <div className="relative">
                    <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" /> 
                    <input
                      type="text"
                      placeholder="Search care centers by name or location..." 
                      className="w-full pl-16 pr-6 py-4 
                                rounded-3xl 
                                border border-gray-100 
                                focus:border-orange-500 
                                focus:outline-none 
                                focus:ring-4 focus:ring-orange-300/70 
                                text-gray-800 
                                font-medium
                                shadow-xl shadow-gray-300/50 /* Shadow ko zyada defined kiya */
                                transition-all duration-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
        {/* --- END SEARCH BAR --- */}


        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-0">
            {/* Loading State */}
            {status === "loading" && (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    icon: ICONS[f.icon],
                  }))}
                  actions={getBranchActions(navigate, branch).map((action) => ({
                    ...action,
                    color: action.label === "Donate" ? "orange" : "indigo",
                    icon:
                      action.label === "Explore" ? ICONS.ArrowRight : ICONS.Donate,
                  }))}
                />
              ))}
            </div>

            {/* Empty State */}
            {status !== "loading" && filteredBranches?.length === 0 && (
              <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-200">
                <p className="text-xl font-semibold">
                    No branches found matching "{searchTerm}".
                </p>
                <p className="text-sm mt-2">Try searching by a different name or location.</p>
              </div>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorExploreBranchesPage;