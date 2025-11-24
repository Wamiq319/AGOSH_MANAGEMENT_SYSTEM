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
  FaUniversity,
  FaQrcode,
  FaDollarSign,
  FaCoins,
} from "react-icons/fa";
import { Button, Toast, Navbar, Footer, FormModal } from "@/components";

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

  const { branchId, branchName, studentId, studentName, donationType } =
    location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [branchPaymentInfo, setBranchPaymentInfo] = useState(null);
  const [isPaymentInfoLoading, setIsPaymentInfoLoading] = useState(true);

  console.log(donationType);
  
  // Fetch branch payment info
  useEffect(() => {
    if (!branchId) {
      setToast({ message: "Error: Donation target not set.", type: "error" });
      setTimeout(() => navigate("/explore-branches"), 1000);
      return;
    }

    dispatch(fetchResourceById({ resource: "branches", id: branchId }))
      .then((result) => {
        const payloadData = result.payload.data;
        if (payloadData && payloadData.paymentInfo) {
          setBranchPaymentInfo(payloadData.paymentInfo);
        } else {
          setToast({
            message: "Could not load payment details for the branch.",
            type: "error",
          });
        }
      })
      .catch(() =>
        setToast({ message: "Failed to fetch branch details.", type: "error" })
      )
      .finally(() => setIsPaymentInfoLoading(false));
  }, [dispatch, branchId, navigate]);

  // Form submission handler
  const handleFormSubmit = async (formData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setToast({ message: "Please login to continue.", type: "error" });
      return;
    }

    if (!formData.amount || formData.amount <= 0 || !formData.receiptImage) {
      setToast({
        message: "Please enter amount and upload receipt.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    const body = {
      donor: user._id,
      branch: branchId || formData.branch,
      amount: Number(formData.amount),
      studentId: donationType === "SPECIFIC_STUDENT" ? studentId : null,
      receiptImage: formData.receiptImage,
      notes: formData.notes || "",
      ...(donationType === "SPECIFIC_STUDENT" &&
        studentId && { student: studentId }),
    };

    try {
      const result = await dispatch(
        createResource({ resource: "donations/create", body })
      );
      if (result.meta.requestStatus === "fulfilled") {
        setToast({
          message: "Donation submitted successfully!",
          type: "success",
        });
      } else {
        setToast({
          message: result.payload || "Failed to submit donation.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define Form Fields
  const getFormFields = () => [
    {
      label: "Donated Amount (PKR)",
      name: "amount",
      type: "number",
      required: true,
      icon: FaDollarSign,
      placeholder: "Enter the exact amount transferred",
    },
    {
      label: "Notes",
      name: "notes",
      type: "textarea",
      rows: 1,
      required: false,
      placeholder: "A special request or acknowledgement.",
    },
    { label: "Receipt", name: "receiptImage", type: "image", required: true },
  ];

  const donationTargetText =
    donationType === "SPECIFIC_STUDENT"
      ? `You are sponsoring: ${studentName}`
      : `General Fund for: ${branchName}`;

  if (isPaymentInfoLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-50">
        <p className="ml-3 text-lg text-gray-600">
          Preparing payment instructions...
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
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
          {/* Donation Target */}
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

          {/* Payment Instructions */}
          <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaMoneyBillWave className="mr-3 text-indigo-600" /> 1. Make Your
            Payment
          </h2>
          <p className="mb-6 text-gray-600 text-sm">
            Transfer the amount to the following verified account and take a
            screenshot or download the receipt.
          </p>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <PaymentInfoCard
              icon={FaUniversity}
              label="Bank / Service Name"
              value={branchPaymentInfo?.bankName}
            />
            <PaymentInfoCard
              icon={FaCoins}
              label="Account Title"
              value={branchPaymentInfo?.accountTitle}
            />
            <PaymentInfoCard
              icon={FaQrcode}
              label="Account Number"
              value={branchPaymentInfo?.accountNumber}
              valueClass="text-orange-600 break-all font-extrabold"
            />
          </div>

          {/* FormModal for Donation */}
          <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaCloudUploadAlt className="mr-3 text-indigo-600" /> 2. Upload
            Proof
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Please fill in the exact amount you transferred and upload the
            payment receipt to finalize your donation.
          </p>

          <FormModal
            isSubmitting={isSubmitting}
            fields={getFormFields()}
            onSubmit={handleFormSubmit}
          >
            <Button
              type="submit"
              variant="filled"
              color="orange"
              className="flex items-center gap-2 justify-center w-full px-6 py-3 text-lg bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : "Confirm Donation & Upload Proof"}
            </Button>
          </FormModal>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonatePage;
