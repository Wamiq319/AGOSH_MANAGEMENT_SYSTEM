import Student from "../models/Student.js";
import Donation from "../models/Donation.js";
import Branch from "../models/Branch.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ------------------ FOR HEAD_OFFICE_ADMIN ------------------
const getAdminDashboardData = async () => {
  const [
    totalStudents,
    totalDonations,
    totalBranches,
    totalUsers,
    recentDonations,
    recentStudents,
  ] = await Promise.all([
    Student.countDocuments(),
    Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Branch.countDocuments(),
    User.countDocuments(),
    Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("donor", "name")
      .populate("branch", "name"),
    Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("branch", "name"),
  ]);

  return {
    status: "SUCCESS",
    data: {
      totalStudents,
      totalDonations: totalDonations[0]?.total || 0,
      totalBranches,
      totalUsers,
      recentDonations,
      recentStudents,
    },
  };
};

// ------------------ FOR BRANCH_ADMIN ------------------
const getBranchAdminDashboardData = async (branchId) => {
  const [
    totalStudents,
    totalDonations,
    branchDetails,
    recentDonations,
    recentStudents,
  ] = await Promise.all([
    Student.countDocuments({ branch: branchId }),
    Donation.aggregate([
      { $match: { branch: new mongoose.Types.ObjectId(branchId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Branch.findById(branchId),
    Donation.find({ branch: branchId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("donor", "name"),
    Student.find({ branch: branchId }).sort({ createdAt: -1 }).limit(5),
  ]);

  return {
    status: "SUCCESS",
    data: {
      totalStudents,
      totalDonations: totalDonations[0]?.total || 0,
      branchDetails,
      recentDonations,
      recentStudents,
    },
  };
};

// ------------------ MAIN DASHBOARD SERVICE ------------------
export const getDashboardData = async (user) => {
  try {
    switch (user.role) {
      case "HEAD_OFFICE_ADMIN":
        return await getAdminDashboardData();
      case "BRANCH_ADMIN":
        if (!user.branch) {
          return {
            status: "FORBIDDEN",
            message: "Branch admin is not associated with any branch.",
          };
        }
        return await getBranchAdminDashboardData(user.branch);
      default:
        return {
          status: "FORBIDDEN",
          message: "You are not authorized to view this dashboard.",
        };
    }
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};
