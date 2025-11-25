import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchResourceById } from "@/redux/slices/resourcesSLice";
import { DataTable, Button, Modal } from "@/components";
import {
  FaEye,
  FaUser,
  FaDollarSign,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle,
  FaPaperclip,
  FaMoneyBillWave,
  FaUniversity,
  FaQrcode,
} from "react-icons/fa";

// --- Donation Details Modal ---
const DonationDetailsModal = ({
  donation,
  onClose,
  // onAction,
  // isActionLoading,
}) => {
  if (!donation) return null;

  const isSpecific = !!donation.student;
  const isPending = donation.status === "PENDING";

  // Customize header title based on status
  const getHeaderTitle = () => {
    return isPending
      ? `Review Donation ID: ${donation._id.slice(-6)}`
      : `Details for Donation ID: ${donation._id.slice(-6)}`;
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      headerTitle={getHeaderTitle()}
      size="lg"
      showSecondaryActionButton={true}
      secondaryActionText="Close"
      showPrimaryActionButton={false}
    >
      {/* Modal Body Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Column 1: Transaction Details */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3">
            Transaction Details
          </h3>

          {/* Donor */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs uppercase text-gray-500 font-semibold flex items-center mb-1">
              <FaUser className="mr-2" /> Donor
            </p>
            <p className="font-medium text-gray-800">
              {donation.donor?.name || "Unknown Donor"}
            </p>
          </div>

          {/* Amount */}
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #dcfce7",
            }}
          >
            <p className="text-xs uppercase text-green-700 font-semibold flex items-center mb-1">
              <FaDollarSign className="mr-2" /> Amount Transferred
            </p>
            <p className="text-2xl font-extrabold text-green-800">
              PKR {donation.amount.toLocaleString()}
            </p>
          </div>

          {/* Target */}
          <div className="p-3 rounded-lg bg-white shadow-sm">
            <p className="text-xs uppercase text-gray-500 font-semibold flex items-center mb-1">
              <FaTag className="mr-2" /> Beneficiary
            </p>
            <p
              className={`font-bold ${
                isSpecific ? "text-purple-600" : "text-green-600"
              }`}
            >
              {isSpecific
                ? `Student: ${donation.student.name}`
                : "General Branch Fund"}
            </p>
          </div>

          {/* Date and Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-gray-100">
              <p className="text-xs uppercase text-gray-500 font-semibold flex items-center mb-1">
                <FaCalendarAlt className="mr-2" /> Date
              </p>
              <p className="font-medium text-gray-800">
                {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor:
                  donation.status === "APPROVED"
                    ? "#d1fae5"
                    : donation.status === "REJECTED"
                    ? "#fee2e2"
                    : "#fffbeb",
                color:
                  donation.status === "APPROVED"
                    ? "#047857"
                    : donation.status === "REJECTED"
                    ? "#b91c1c"
                    : "#b45309",
                border: `1px solid ${
                  donation.status === "APPROVED"
                    ? "#a7f3d0"
                    : donation.status === "REJECTED"
                    ? "#fecaca"
                    : "#fde68a"
                }`,
              }}
            >
              <p className="text-xs uppercase font-semibold flex items-center mb-1">
                <FaCheckCircle className="mr-2" /> Status
              </p>
              <p className="font-bold">{donation.status}</p>
            </div>
          </div>
        </div>

        {/* Column 2: Payment Details */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3">
            Bank Details
          </h3>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs uppercase text-gray-500 font-semibold flex items-center mb-1">
              <FaUniversity className="mr-2 text-indigo-500" /> Bank Name
            </p>
            <p className="font-medium text-gray-800">
              {donation.branch?.paymentInfo?.bankName || "N/A"}
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs uppercase text-gray-500 font-semibold flex items-center mb-1">
              Account Title
            </p>
            <p className="font-medium text-gray-800">
              {donation.branch?.paymentInfo?.accountTitle || "N/A"}
            </p>
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs uppercase text-orange-700 font-semibold flex items-center mb-1">
              <FaQrcode className="mr-2" /> Account Number
            </p>
            <p className="font-bold text-orange-800 break-all">
              {donation.branch?.paymentInfo?.accountNumber || "N/A"}
            </p>
          </div>

          {donation.notes && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-300">
              <p className="text-xs uppercase text-blue-700 font-semibold">
                Donor Notes
              </p>
              <p className="font-medium text-blue-800 italic">
                {donation.notes}
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Receipt Image */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3 flex items-center">
            <FaPaperclip className="mr-2 text-indigo-500" /> Payment Receipt
          </h3>
          <div className="bg-gray-100 p-2 rounded-lg border border-dashed border-gray-300">
            <a
              href={donation.receiptImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition"
            >
              <img
                src={donation.receiptImage}
                alt={`Receipt for donation ${donation._id.slice(-6)}`}
                className="w-full h-auto max-h-80 object-contain"
              />
            </a>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Click image to view full size.
          </p>

          {/* Custom Action Buttons for PENDING status
          {isPending && (
            <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={() => onAction(donation._id, "REJECTED")}
                variant="soft"
                color="red"
                disabled={isActionLoading}
                className="flex items-center gap-2"
              >
                Reject
              </Button>
              <Button
                onClick={() => onAction(donation._id, "APPROVED")}
                variant="filled"
                color="green"
                disabled={isActionLoading}
                className="flex items-center gap-2"
              >
                {isActionLoading ? (
                  "Approving..."
                ) : (
                  <>
                    Approve <FaCheckCircle />
                  </>
                )}
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </Modal>
  );
};

// --- Main Component ---
const BranchDonationsPage = () => {
  const dispatch = useDispatch();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Get Branch ID
  const user = JSON.parse(localStorage.getItem("user"));
  const branchId = user?.branch?._id || user?.branch;

  const [branchDetails, setBranchDetails] = useState(null);

  const loadDonations = async () => {
    if (!branchId) return;
    setLoading(true);

    // 1. Fetch Donations
    const donationResult = await dispatch(
      fetchResourceById({ resource: "donations/branch", id: branchId })
    );

    const branchResult = await dispatch(
      fetchResourceById({ resource: "branches", id: branchId })
    );

    if (donationResult.payload) {
      setDonations(donationResult.payload?.data);
    }
    if (branchResult.payload) {
      setBranchDetails(branchResult.payload?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDonations();
  }, [branchId, dispatch]);

  const handleViewDetails = (donationData) => {
    // Attach current branch details to donation data for modal display
    const donationWithBranch = {
      ...donationData,
      branch: branchDetails,
    };
    setSelectedDonation(donationWithBranch);
    setShowModal(true);
  };

  const handleDonationAction = async (donationId, newStatus) => {
    setIsActionLoading(true);

    // **TODO: Replace this with your actual API endpoint for updating status**
    try {
      // Simulating success delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update state locally
      setDonations((prev) =>
        prev.map((d) =>
          d._id === donationId ? { ...d, status: newStatus } : d
        )
      );
      setSelectedDonation((prev) => ({ ...prev, status: newStatus }));

      if (newStatus === "APPROVED" || newStatus === "REJECTED") {
        // setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const totalGeneralFund = useMemo(() => {
    return donations
      .filter((d) => !d.student)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [donations]);

  const filteredDonations = donations.filter((d) => {
    if (filterType === "GENERAL") return !d.student;
    if (filterType === "SPECIFIC") return d.student;
    return true;
  });

  const tableHeader = [
    { key: "donorName", label: "Donor" },
    { key: "type", label: "Type" },
    { key: "studentName", label: "Beneficiary" },
    { key: "amount", label: "Amount" },
    { key: "createdAt", label: "Date" },
    { key: "actions", label: "Actions" },
  ];

  const formattedData = filteredDonations.map((d) => ({
    ...d,
    donorName: d.donor?.name || "Unknown",

    type: d.student ? (
      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">
        SPECIFIC
      </span>
    ) : (
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
        GENERAL
      </span>
    ),

    studentName: d.student ? (
      <span className="font-medium text-gray-800">{d.student.name}</span>
    ) : (
      <span className="italic text-gray-500">Entire Branch</span>
    ),

    amount: (
      <span className="font-bold text-orange-600">
        PKR {d.amount.toLocaleString()}
      </span>
    ),

    status: (
      <span
        className={`px-2 py-1 rounded text-xs font-bold ${
          d.status === "APPROVED"
            ? "bg-green-100 text-green-600"
            : d.status === "REJECTED"
            ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {d.status}
      </span>
    ),

    createdAt: new Date(d.createdAt).toLocaleDateString(),

    actions: (
      <Button
        onClick={() => handleViewDetails(d)}
        variant="filled"
        color="indigo"
        className="px-3 py-1 text-xs flex items-center gap-1"
      >
        <FaEye size={12} /> View Details
      </Button>
    ),
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 border-b-2 border-orange-500 pb-1">
            <FaMoneyBillWave className="inline-block mr-3 text-orange-600" />{" "}
            Branch Donations Overview
          </h1>

          <div className="bg-white px-5 py-3 rounded-xl shadow-lg border border-green-200">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              General Fund Pool
            </p>
            <p className="text-2xl font-extrabold text-green-600">
              PKR {totalGeneralFund.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {["ALL", "GENERAL", "SPECIFIC"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                filterType === type
                  ? "bg-orange-600 text-white shadow-md shadow-orange-300"
                  : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 border border-gray-200"
              }`}
            >
              {type === "ALL"
                ? "All Donations"
                : type === "GENERAL"
                ? "General Fund"
                : "Student Specific"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-xl shadow-lg">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-lg text-gray-600">Loading Donations...</p>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <p className="text-xl text-gray-500">
              No donations found for this category.
            </p>
          </div>
        ) : (
          <DataTable
            heading={`${
              filterType === "ALL"
                ? "All"
                : filterType === "GENERAL"
                ? "General"
                : "Specific"
            } Donations`}
            tableHeader={tableHeader}
            tableData={formattedData}
            className="bg-white rounded-xl shadow-lg border border-gray-100"
          />
        )}
      </div>

      {/* RENDER MODAL */}
      {showModal && selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setShowModal(false)}
          onAction={handleDonationAction}
          isActionLoading={isActionLoading}
        />
      )}
    </div>
  );
};

export default BranchDonationsPage;
