import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResourceById,
  fetchResources,
} from "@/redux/slices/resourcesSLice";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaUserTie,
  FaMoneyCheckAlt,
  FaUniversity,
  FaQrcode,
  FaChild,
  FaHandHoldingHeart,
  FaCoins,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Button, Navbar, Footer } from "@/components";

// Reusable component for clean, card-like information display
const InfoItem = ({ icon, label, value, colorClass = "text-gray-700" }) => {
  const Component = icon;
  return (
    <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {Component ? (
        <Component className={`mt-1 mr-3 text-xl ${colorClass}`} />
      ) : null}
      <div>
        <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-800 break-all">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

// Main Section Card: Uses a light background and minimal styling for clarity
const SectionCard = ({ children, className = "" }) => {
  return (
    <div
      className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};
// ----------------------------------------------------

const BranchDetailPage = () => {
  const { id: branchId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, status, error } = useSelector((state) => state.resources);
  const branch = data.branchesById;
  const students = data.students;
  const studentsForBranch = students?.filter(
    (student) => student.branch._id === branchId
  );

  console.log(students);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchResourceById({ resource: "branches", id: branchId }))
      .then(() => {
        return dispatch(
          fetchResources({
            resource: "students",
            params: { branchId: branchId },
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, branchId]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen ">
        <p className="ml-3 text-lg text-gray-600">Loading branch details...</p>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="text-center py-20 bg-white text-red-600 rounded-lg m-8 shadow-lg">
        <h2 className="text-2xl font-semibold">Error: Branch Not Found</h2>
        <p>Could not load details for this branch. Please try again.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }
  const { bankName, accountTitle, accountNumber } = branch.paymentInfo || {};

  const handleDirectDonate = () => {
    navigate("/donate", {
      state: {
        branchId: branch._id,
        branchName: branch.name,
        donationType: "GENERAL",
        bankName,
        accountTitle,
        accountNumber,
      },
    });
  };

  const handleSponsorStudent = (studentId, studentName) => {
    navigate("/donate", {
      state: {
        branchId: branch._id,
        branchName: branch.name,
        studentId: studentId,
        studentName: studentName,
        bankName,
        accountTitle,
        accountNumber,
        donationType: "SPECIFIC_STUDENT",
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen ">
        {/* -------------------- Branch Information Header -------------------- */}
        <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-orange-600 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center mb-1">
            <FaBuilding className="mr-3 text-orange-600" />
            {branch.name}
          </h1>
          <p className="text-md text-gray-500">
            Details for the branch center in **{branch.location}**.
          </p>
        </div>

        {/* -------------------- Key Branch Details (Professional Cards) -------------------- */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
          <FaUserTie className="mr-2 text-indigo-600" /> Key Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <InfoItem
            icon={FaMapMarkerAlt}
            label="Location"
            value={branch.location}
            colorClass="text-red-500"
          />
          <InfoItem
            icon={FaPhone}
            label="Phone Number"
            value={branch.phoneNumber}
            colorClass="text-green-600"
          />
          <InfoItem
            icon={FaUserTie}
            label="Admin"
            value={branch.admin?.name || "N/A"}
            colorClass="text-indigo-600"
          />
          <InfoItem
            icon={FaChild}
            label="Total Students"
            value={studentsForBranch?.length || 0}
            colorClass="text-orange-600"
          />
        </div>

        {/* -------------------- Payment & Direct Donate Section (Orange Highlight) -------------------- */}
        <SectionCard className="mb-10 bg-orange-50 border-orange-200 border-t-4">
          <h2 className="text-2xl font-bold text-orange-700 flex items-center mb-4 pb-2 border-b border-orange-200">
            <FaMoneyCheckAlt className="mr-3 text-orange-600" /> General Fund
            Donation
          </h2>
          <p className="mb-6 text-gray-700 text-sm">
            Please use the following verified details for general operational
            donations for **{branch.name}**.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InfoItem
              icon={FaUniversity}
              label="Bank / Service Name"
              value={bankName}
              colorClass="text-orange-600"
            />
            <InfoItem
              icon={FaCoins}
              label="Account Title"
              value={accountTitle}
              colorClass="text-orange-600"
            />
            <InfoItem
              icon={FaQrcode}
              label="Account Number"
              value={accountNumber}
              colorClass="text-orange-600"
            />
          </div>

          <Button
            onClick={handleDirectDonate}
            variant="filled"
            // Use Primary Color: Orange-600 for the main Call To Action
            color="orange"
            className="flex items-center gap-2 mt-6 justify-center text-md px-8 py-3 w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white"
          >
            Confirm Donation & Upload Receipt <IoIosArrowForward size={16} />
          </Button>
        </SectionCard>

        {/* -------------------- Students Section (Indigo Accent) -------------------- */}
        <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-6 pb-2 border-b border-gray-300">
          <FaChild className="mr-2 text-indigo-600" /> Students Available for
          Sponsorship
        </h2>

        {studentsForBranch?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {studentsForBranch.map((student) => (
              <div
                key={student._id}
                className="p-4 text-center flex flex-col items-center bg-white rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 border border-gray-200 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-full mb-3 flex items-center justify-center text-indigo-600 text-2xl font-bold border border-indigo-200">
                  {student.name ? student.name.charAt(0) : "S"}
                </div>
                <h3 className="text-md font-semibold text-gray-800 line-clamp-1 mb-1">
                  {student.name || `Student #${student._id.slice(-4)}`}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {student.age ? `${student.age} yrs` : "Age N/A"}
                </p>
                <Button
                  onClick={() =>
                    handleSponsorStudent(student._id, student.name)
                  }
                  variant="filled"
                  className="mt-2 flex items-center gap-1 text-xs py-2 px-3 w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <FaHandHoldingHeart size={12} /> Sponsor
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300 shadow-sm">
            <p className="text-lg text-gray-500 flex items-center justify-center">
              <FaChild className="mr-2 text-xl" />
              No students are currently available for specific sponsorship.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BranchDetailPage;
