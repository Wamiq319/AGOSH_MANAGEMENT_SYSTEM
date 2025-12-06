import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createResource,
  fetchResourceById,
} from "@/redux/slices/resourcesSLice";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaQrcode,
  FaDollarSign,
  FaLock,
} from "react-icons/fa";
import { RiBankCardFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { Button, Toast, Navbar, Footer, FormModal } from "@/components";

// --- Reusable Component: Section Card  ---
const SectionCard = ({ children, className = "" }) => {
  return (
    <div
      className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

const DonatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allowed, setAllowed] = useState(null);

  const { branchId, branchName, studentId, studentName, donationType } =
    location.state || {};
console.log(branchId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [branchPaymentInfo, setBranchPaymentInfo] = useState(null);
  const [isPaymentInfoLoading, setIsPaymentInfoLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "DONOR") {
      setAllowed(false);
      return;
    }

    setAllowed(true);
  }, [navigate]);

  // Fetch branch payment info
  useEffect(() => {
    if (!branchId) {
      setToast({ message: "Error: Donation target not set.", type: "error" });
      setTimeout(() => navigate("/branches"), 1000);
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

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Checking permissions...
      </div>
    );
  }

  // Form submission handler
  const handleFormSubmit = async (formData) => {
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
          message:
            "Donation submitted successfully! Thank you for your support.",
          type: "success",
        });
      } else {
        setToast({
          message: result.payload?.message || "Failed to submit donation.",
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
      label: "Notes (Optional)",
      name: "notes",
      type: "textarea",
      rows: 1,
      required: false,
      placeholder: "A special request or acknowledgement.",
    },
    {
      label: "Receipt Image",
      name: "receiptImage",
      type: "image",
      required: true,
    },
  ];

  const isSpecific = donationType === "SPECIFIC_STUDENT";
  const donationTargetText = isSpecific
    ? `${studentName}`
    : `General Fund for ${branchName}`;

  if (isPaymentInfoLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 font-medium">
          Preparing secure payment instructions...
        </p>
      </div>
    );
  }

  const { bankName, accountTitle, accountNumber } = branchPaymentInfo || {};

  if (allowed === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          Please login as a <strong>Donor</strong> to access this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Go to previous page
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* --- HERO SECTION (Consistent Orange Gradient) --- */}
      <div className="relative bg-gradient-to-r from-orange-600 to-amber-500 pt-16 pb-24 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
              Confirm Your Donation
            </h1>
            <p className="text-orange-100 text-lg flex items-center justify-center md:justify-start gap-2">
              <FaLock /> Secure Contribution Process
            </p>
          </div>
          <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest text-center">
              Your Target
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div
                className={`p-2 rounded-full ${
                  isSpecific
                    ? "bg-white text-indigo-600"
                    : "bg-white text-green-600"
                }`}
              >
                <FaCheckCircle />
              </div>
              <span className="text-xl font-bold">
                {isSpecific ? "Specific Student" : "Branch General Fund"}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8 -mt-16 relative z-20">
        {/* --- MAIN 2-COLUMN LAYOUT (Matching Branch Detail Page) --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (1/3): PAYMENT DETAILS (Sticky Step 1) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden sticky top-6">
              <div className="bg-orange-50 p-6 border-b border-orange-100">
                <h2 className="text-xl font-bold text-orange-800 flex items-center gap-2">
                  <RiBankCardFill className="text-orange-600 text-2xl" /> STEP
                  1: Bank Details
                </h2>
                <p className="text-orange-600/70 text-sm mt-1">
                  Please transfer the amount first.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  {/* Bank Name */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs uppercase font-semibold block mb-1">
                      Bank / Service Name
                    </span>
                    <span className="font-bold text-gray-800 text-lg">
                      {bankName}
                    </span>
                  </div>

                  {/* Account Title */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs uppercase font-semibold block mb-1">
                      Account Title
                    </span>
                    <span className="font-bold text-gray-800 text-lg break-all">
                      {accountTitle}
                    </span>
                  </div>

                  {/* Account Number (Highlight) */}
                  <div>
                    <span className="text-orange-500 text-sm font-semibold  mb-1 flex items-center gap-1">
                      <FaQrcode /> Account Number (Crucial)
                    </span>
                    <div className="bg-orange-100 p-3 rounded-lg flex items-center justify-between border-2 border-orange-300">
                      <span className="font-mono text-xl font-extrabold text-orange-700 break-all">
                        {accountNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (2/3): TARGET & FORM UPLOAD --- */}
          <div className="lg:col-span-2">
            {/* 1. Target Confirmation Card */}
            <SectionCard
              className={`mb-8 p-6 ${
                isSpecific ? "bg-indigo-50 " : "bg-green-50"
              }`}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-1 flex items-center">
                <FaCheckCircle
                  className={`mr-2 ${
                    isSpecific ? "text-indigo-600" : "text-green-600"
                  }`}
                />
                Your Donation Target
              </h3>
              <p
                className={`text-3xl font-extrabold ${
                  isSpecific ? "text-indigo-800" : "text-green-800"
                } ml-5`}
              >
                {donationTargetText}
              </p>
              <p className="ml-5 text-gray-600">(Branch: {branchName})</p>
            </SectionCard>

            {/* 2. Upload Form Section (Step 2) */}
            <SectionCard>
              <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-6 pb-2 border-b border-gray-300">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-3 font-extrabold text-lg flex items-center justify-center h-10 w-10">
                  2
                </span>
                <FaCloudUploadAlt className="mr-3 text-indigo-600" /> Upload
                Proof & Finalize
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Fill in the form with the exact amount you transferred and
                upload the payment receipt to finalize your donation.
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
                  // Custom styling for strong CTA
                  className="flex items-center gap-2 justify-center w-full px-6 py-3 text-lg bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-300/50 rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting Donation..."
                  ) : (
                    <>
                      Confirm Donation & Upload Proof{" "}
                      <IoIosArrowForward size={16} />
                    </>
                  )}
                </Button>
              </FormModal>
            </SectionCard>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonatePage;
