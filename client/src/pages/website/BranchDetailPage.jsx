import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResourceById,
  fetchResources,
} from "@/redux/slices/resourcesSLice";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaUserTie,
  FaUniversity,
  FaQrcode,
  FaChild,
  FaHandHoldingHeart,
  FaArrowRight,
} from "react-icons/fa";
import { RiBankCardFill } from "react-icons/ri";
import { Button, Navbar, Footer } from "@/components";


// 1. Stat/Info Card (Modern)
const StatCard = ({ icon, label, value, colorClass, bgClass }) => {
  const Icon = icon;
  return (
    <div className="flex items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        {Icon ? <Icon size={24} /> : null}
      </div>
      <div className="ml-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-800 line-clamp-1">{value || "N/A"}</p>
      </div>
    </div>
  );
};

// 2. Student Card (Profile Style)
const StudentCard = ({ student, onSponsor }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
      {/* Top Gradient Decoration */}
      <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-90"></div>
      
      {/* Avatar Circle */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-md">
          {student.name ? student.name.charAt(0) : "S"}
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 pb-6 px-4 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{student.name}</h3>
        <p className="text-sm text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-full">
          {student.age ? `${student.age} Years Old` : "Age N/A"}
        </p>

        <button
          onClick={() => onSponsor(student._id, student.name)}
          className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaHandHoldingHeart /> Sponsor Now
        </button>
      </div>
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
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading Details...</p>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
           <h2 className="text-2xl font-bold text-red-500 mb-2">Branch Not Found</h2>
           <p className="text-gray-500 mb-6">We couldn't locate the details for this branch.</p>
           <Button onClick={() => navigate(-1)} variant="filled" color="gray">Go Back</Button>
        </div>
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-gradient-to-r from-orange-600 to-amber-500 pt-16 pb-24 px-6 shadow-lg">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="text-white text-center md:text-left">
               <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{branch.name}</h1>
               <p className="text-orange-100 text-lg flex items-center justify-center md:justify-start gap-2">
                 <FaMapMarkerAlt /> {branch.location}
               </p>
            </div>
            <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
                <p className="text-sm font-medium opacity-80 uppercase tracking-widest text-center">Branch Manager</p>
                <div className="flex items-center gap-3 mt-2">
                    <div className="bg-white text-orange-600 p-2 rounded-full"><FaUserTie /></div>
                    <span className="text-xl font-bold">{branch.admin?.name || "N/A"}</span>
                </div>
            </div>
         </div>
         {/* Decorative Circle */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8 -mt-16 relative z-20">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <StatCard 
             icon={FaPhone} 
             label="Contact Number" 
             value={branch.phoneNumber} 
             bgClass="bg-blue-50" 
             colorClass="text-blue-600" 
          />
          <StatCard 
             icon={FaChild} 
             label="Total Beneficiaries" 
             value={`${studentsForBranch?.length || 0} Students`} 
             bgClass="bg-purple-50" 
             colorClass="text-purple-600" 
          />
          <StatCard 
             icon={FaMapMarkerAlt} 
             label="Location" 
             value={branch.location} 
             bgClass="bg-red-50" 
             colorClass="text-red-500" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN: GENERAL DONATION (Featured) --- */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden sticky top-6">
                    <div className="bg-orange-50 p-6 border-b border-orange-100">
                        <h2 className="text-xl font-bold text-orange-800 flex items-center gap-2">
                            <RiBankCardFill className="text-orange-600 text-2xl" /> General Fund
                        </h2>
                        <p className="text-orange-600/70 text-sm mt-1">Support the branch operations directly.</p>
                    </div>
                    
                    <div className="p-6 space-y-5">
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                                <span className="text-gray-500 text-sm">Bank Name</span>
                                <span className="font-semibold text-gray-800 text-right">{bankName}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                                <span className="text-gray-500 text-sm">Title</span>
                                <span className="font-semibold text-gray-800 text-right">{accountTitle}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-sm block mb-1">Account Number</span>
                                <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                                    <span className="font-mono text-lg font-bold text-gray-700">{accountNumber}</span>
                                    <FaQrcode className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleDirectDonate}
                            variant="filled"
                            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-200 rounded-xl flex items-center justify-center gap-2 text-md font-bold transition-all transform hover:scale-[1.02]"
                        >
                            Donate to General Fund <FaArrowRight />
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: STUDENTS GRID --- */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-lg"><FaChild /></span> 
                        Needy Students
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                        {studentsForBranch?.length} Available
                    </span>
                </div>

                {studentsForBranch?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studentsForBranch.map((student) => (
                            <StudentCard 
                                key={student._id} 
                                student={student} 
                                onSponsor={handleSponsorStudent} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                            <FaChild className="text-gray-400 text-3xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No students currently available for specific sponsorship.</p>
                    </div>
                )}
            </div>

        </div>
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default BranchDetailPage;