import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createResource,
  fetchResourceById,
} from "@/redux/slices/resourcesSLice";
import {
  FaHandHoldingHeart,
  FaMoneyBillWave,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUniversity,
  FaQrcode,
  FaDollarSign,
  FaCoins, // Using FaCoins for Account Title
} from "react-icons/fa";
import { Button, Toast, Navbar, Footer } from "@/components";

// Helper Component for Payment Info Cards
const PaymentInfoCard = ({ icon, label, value, valueClass = "" }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm uppercase font-semibold text-gray-500 mb-1 flex items-center">
        {Icon ? <Icon className="mr-2 text-indigo-500" /> : null} {label}
      </h3>
      <p className={`text-xl font-bold text-gray-800 ${valueClass}`}>
        {value || "N/A"}
      </p>
    </div>
  );
};

const DonatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State jo Explore Page se pass hua tha
  const { branchId, branchName, studentId, studentName, donationType } =
    location.state || {};

  // Local Form State
  const [amount, setAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // State for fetching Branch Payment Info
  const [branchPaymentInfo, setBranchPaymentInfo] = useState(null);
  const [isPaymentInfoLoading, setIsPaymentInfoLoading] = useState(true);

  // Redirect agar required data nahi hai
  useEffect(() => {
    if (!branchId) {
      setToast({ message: "Error: Donation target not set.", type: "error" });
      setTimeout(() => navigate("/explore-branches"), 1000);
      return;
    }

    // Fetch Branch details to display its Payment Info
    dispatch(fetchResourceById({ resource: "branches", id: branchId }))
      .then((result) => {
        if (result.payload && result.payload.paymentInfo) {
          setBranchPaymentInfo(result.payload.paymentInfo);
        } else {
          setToast({
            message: "Could not load payment details for the branch.",
            type: "error",
          });
        }
      })
      .catch(() => {
        setToast({ message: "Failed to fetch branch details.", type: "error" });
      })
      .finally(() => {
        setIsPaymentInfoLoading(false);
      });
  }, [dispatch, branchId, navigate]);

  // Form Submission Handler (Logic remains the same)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0 || !receiptFile) {
      setToast({
        message: "Please enter a valid amount and upload a receipt.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    const uploadedFileUrl =
      "https://your-server.com/receipts/" + receiptFile.name;

    const body = {
      amount: Number(amount),
      receiptImage: uploadedFileUrl,
      donor: "USER_ID_FROM_SESSION",
      branch: branchId,
      category: donationType,
      ...(studentId && { studentRecipient: studentId }),
    };

    try {
      const result = await dispatch(
        createResource({ resource: "donations", body: body })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setToast({
          message: "Donation submitted! Awaiting Admin verification.",
          type: "success",
        });
        setAmount("");
        setReceiptFile(null);
        navigate("/donation-success", { replace: true });
      } else {
        setToast({
          message: result.payload || "Failed to submit donation.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: "An unexpected error occurred.", type: "error" });
      console.log(error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Content for the target
  const donationTargetText =
    donationType === "SPECIFIC_STUDENT"
      ? `You are sponsoring: ${studentName}`
      : `General Fund for: ${branchName}`;

  // Loading State
  if (isPaymentInfoLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-50">
        <p className="ml-3 text-lg text-gray-600">
          Preparing payment instructions...
        </p>
      </div>
    );
  }

  // Main UI
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <FaHandHoldingHeart className="text-6xl text-orange-600 mx-auto mb-3" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Confirm Your Donation
          </h1>
          <p className="text-lg text-gray-500">
            Please make the payment and upload the receipt below.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-orange-600">
          {/* Donation Target Context - Highlighted */}
          <div
            className={`p-4 mb-8 rounded-lg border-l-4 ${
              donationType === "SPECIFIC_STUDENT"
                ? "bg-indigo-50 border-indigo-600 text-indigo-800"
                : "bg-orange-50 border-orange-600 text-orange-800"
            }`}
          >
            <h3 className="text-lg font-semibold flex items-center">
              <FaCheckCircle className="mr-2" /> Donation Target:
            </h3>
            <p className="ml-5 font-bold text-xl">{donationTargetText}</p>
            <p className="ml-5 text-sm mt-1 text-gray-600">
              (Branch: {branchName})
            </p>
          </div>

          {/* ------------------- 1. Payment Instructions Section ------------------- */}
          <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaMoneyBillWave className="mr-3 text-indigo-600" /> 1. Make Your
            Payment
          </h2>
          <p className="mb-6 text-gray-600 text-sm">
            Transfer the amount to the following verified account and take a
            screenshot or download the receipt.
          </p>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Payment Details Card 1: Bank Name */}
            <PaymentInfoCard
              icon={FaUniversity}
              label="Bank / Service Name"
              value={branchPaymentInfo?.bankName}
            />
            {/* Payment Details Card 2: Account Title */}
            <PaymentInfoCard
              icon={FaCoins}
              label="Account Title"
              value={branchPaymentInfo?.accountTitle}
            />
            {/* Payment Details Card 3: Account Number - Highlighted Orange */}
            <PaymentInfoCard
              icon={FaQrcode}
              label="Account Number"
              value={branchPaymentInfo?.accountNumber}
              valueClass="text-orange-600 break-all font-extrabold"
            />
          </div>

          {/* ------------------- 2. Submission Form ------------------- */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-4 pb-2 border-b border-gray-200">
              <FaCloudUploadAlt className="mr-3 text-indigo-600" /> 2. Upload
              Proof
            </h2>

            {/* Amount Input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="amount"
              >
                <FaDollarSign className="inline mr-1 text-orange-600" /> Donated
                Amount (PKR)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                placeholder="Enter the exact amount transferred"
              />
            </div>

            {/* Receipt Upload Input */}
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="receipt"
              >
                <FaCloudUploadAlt className="inline mr-1 text-orange-600" />{" "}
                Upload Payment Receipt/Screenshot
              </label>
              <input
                type="file"
                id="receipt"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                required
                accept="image/*, application/pdf"
                // Custom File Input Styling for Orange
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
              />
              {receiptFile && (
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <FaCheckCircle className="mr-1 text-green-500" /> File
                  selected: **{receiptFile.name}**
                </p>
              )}
            </div>

            {/* Submit Button - Primary Action (Orange) */}
            <Button
              type="submit"
              variant="filled"
              color="orange" // Custom class for Orange button
              isLoading={isSubmitting}
              disabled={isSubmitting || isPaymentInfoLoading}
              className="w-full py-3 text-lg flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting
                ? "Submitting..."
                : "Confirm Donation & Upload Proof"}
            </Button>

            {/* Warning Message */}
            <p className="text-center text-sm mt-3 text-red-600 flex items-center justify-center font-medium">
              <FaExclamationTriangle className="mr-1" /> Your donation will be
              marked as PENDING until verified by the Admin.
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonatePage;
