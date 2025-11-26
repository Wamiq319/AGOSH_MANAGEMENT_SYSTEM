import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchResources } from "@/redux/slices/resourcesSLice";
import { DataTable, Toast, Modal } from "@/components";
import {
  FaEye,
  FaDollarSign,
  FaCodeBranch,
  FaUser,
  FaClipboardList,
  FaReceipt,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";

const DonationsManagementPage = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const donationsResult = await dispatch(
        fetchResources({ resource: "donations/all" })
      ).unwrap();
      setDonations(donationsResult.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setToast({
        message: err.message || "Failed to load donations",
        type: "error",
      });
    }
  };

  useEffect(() => {
    loadDonations();
  }, [dispatch]);

  const handleView = (row) => {
    setSelectedDonation(row);
    setIsViewOpen(true);
  };

  // Currency formatter
  const formatCurrency = (num) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const tableHeader = [
    { label: "Branch", key: "branch.name" },
    { label: "Donor", key: "donor.name" },
    { label: "Amount", key: "amount" },
    { label: "Category", key: "category" },
    { label: "Date", key: "createdAt" },
  ];

  // Format Data for DataTable
  const formattedDonations = donations.map((d) => {
    const amountNumber = Number(d.amount);

    return {
      ...d,
      amountOriginal: amountNumber,
      amount: (
        <span className="font-bold text-lg text-green-700">
          PKR {formatCurrency(amountNumber)}
        </span>
      ),
      "branch.name": d.branch?.name || (
        <span className="text-gray-400">N/A</span>
      ),
      "donor.name": d.donor?.name || <span className="text-gray-400">N/A</span>,
      createdAt: new Date(d.createdAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  // Dynamic View Button
  const getButtons = () => [
    {
      icon: <FaEye />,
      className:
        "bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full",
      onClick: handleView,
      title: "View Details",
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-blue-600">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span className="text-lg font-medium">Loading dashboard...</span>
      </div>
    );

  // --- RENDERING ---
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6 border-b border-orange-300 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-800">
          <FaDollarSign className="inline-block mr-3 text-orange-600" />
          Donations Management
        </h1>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <FaClipboardList className="mx-auto h-16 w-16 text-orange-400 opacity-70 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            No Donations Found
          </h2>
          <p className="text-gray-500 mt-2">
            There are no donation records to display yet.
          </p>
        </div>
      ) : (
        <DataTable
          heading="All Donations"
          tableHeader={tableHeader}
          tableData={formattedDonations}
          dynamicButtons={getButtons}
          className="shadow-xl rounded-xl overflow-hidden"
        />
      )}

      {/* VIEW MODAL */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        headerTitle={
          <span className="font-extrabold">
            Donation ID:{" "}
            <span className="text-orange-600">
              {selectedDonation?._id?.slice(-6)}
            </span>
          </span>
        }
        size="md"
        showSecondaryActionButton={false}
        showPrimaryActionButton={false}
      >
        {selectedDonation && (
          <div className="space-y-6">
            {/* 1. DONOR HEADER CARD */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-orange-50 border border-orange-200 shadow-sm">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-600 text-white text-3xl font-bold mb-3 border-4 border-orange-200">
                {selectedDonation?.donor?.name?.charAt(0) || <FaUser />}
              </div>
              <h2 className="text-xl font-extrabold text-gray-800">
                {selectedDonation?.donor?.name || "Anonymous Donor"}
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <FaEnvelope className="mr-2 text-gray-500" />
                {selectedDonation?.donor?.email || "Email Not Provided"}
              </p>
            </div>

            {/* 2. DONATION DETAILS CARD */}
            <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-xs space-y-4">
              <h3 className="text-lg font-semibold border-b border-orange-300 pb-1 mb-3 text-gray-700">
                <FaDollarSign className="mr-2 text-green-600 inline" /> Donation
                Information
              </h3>

              <DetailItem
                icon={<FaDollarSign className="text-green-700" />}
                label="Amount"
                value={`PKR ${selectedDonation?.amountOriginal?.toLocaleString()}`}
                color="text-green-700 font-extrabold text-xl"
              />
              <DetailItem
                icon={<FaCodeBranch className="text-orange-500" />}
                label="Branch"
                value={selectedDonation?.branch?.name}
                color="text-gray-700 font-semibold"
              />
              <DetailItem
                icon={<FaClipboardList className="text-blue-500" />}
                label="Category"
                value={selectedDonation?.category}
              />
              <DetailItem
                icon={<FaCalendarAlt className="text-gray-500" />}
                label="Donation Date"
                value={new Date(selectedDonation?.createdAt).toLocaleString(
                  "en-GB"
                )}
              />
            </div>

            {/* 3. NOTES & RECEIPT CARD  */}
            <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-xs space-y-4">
              <h3 className="text-lg font-semibold border-b border-orange-300 pb-1 mb-3 text-gray-700">
                <FaReceipt className="mr-2 text-purple-600 inline" /> Notes &
                Receipt
              </h3>

              {/* Notes */}
              <div>
                <h4 className="text-md font-medium text-gray-600 mb-1">
                  Notes:
                </h4>
                <p className="text-gray-700  p-3 rounded min-h-[50px] text-sm bg-orange-50 border border-orange-200  shadow-xs">
                  {selectedDonation?.notes ||
                    "No additional notes were provided by the donor."}
                </p>
              </div>

              {/* Receipt Image */}
              <div>
                <h4 className="text-md font-medium text-gray-600 mb-2">
                  Receipt Image:
                </h4>
                <div className="p-3 border bg-orange-50  border-orange-200 shadow-xs rounded-lg  flex justify-center">
                  {selectedDonation?.receiptImage ? (
                    <img
                      src={selectedDonation?.receiptImage}
                      alt="Receipt"
                      className="max-w-full max-h-64 object-contain rounded cursor-pointer transition hover:shadow-lg"
                      onClick={() =>
                        window.open(selectedDonation?.receiptImage, "_blank")
                      }
                    />
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <span className="block mb-2 text-3xl">🚫</span>
                      No Receipt Uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. DONOR ID/SYSTEM INFO  */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-xs text-center">
              <p className="text-sm text-gray-600 font-semibold">
                System ID:{" "}
                <span className="font-mono text-xs text-orange-600 font-bold ml-1">
                  {selectedDonation?._id}
                </span>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// DetailItem component is kept as is, but its usage is standardized
const DetailItem = ({ icon, label, value, color = "text-gray-700" }) => (
  <div className="flex items-center p-3 border-b border-orange-300 last:border-b border-orange-300-0">
    <div className="w-10 text-xl flex-shrink-0">{icon}</div>
    <span className="font-medium w-1/3 text-gray-600">{label}:</span>
    <span className={`w-2/3 ${color} ml-2`}>{value}</span>
  </div>
);

export default DonationsManagementPage;
