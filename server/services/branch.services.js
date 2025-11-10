import mongoose from "mongoose";
import Branch from "../models/Branch.js";
import { createUser } from "./user.services.js"; // if you want to create admin via service

// ------------------ CREATE BRANCH (optionally with admin) ------------------
export const createBranch = async (branchData, adminData = null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Create branch
    const newBranch = await Branch.create([branchData], { session });

    let newAdmin = null;

    // Step 2: If admin data provided, create admin and link
    if (adminData) {
      newAdmin = await createUser(
        { ...adminData, role: "BRANCH_ADMIN", branch: newBranch[0]._id },
        session
      );

      await Branch.findByIdAndUpdate(
        newBranch[0]._id,
        { admin: newAdmin._id },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return {
      status: "SUCCESS",
      data: { branch: newBranch[0], admin: newAdmin },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ UPDATE BRANCH ------------------
export const updateBranchById = async (branchId, updateData) => {
  const { branch: branchUpdateData, admin: adminUpdateData } = updateData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const branch = await Branch.findById(branchId).session(session);
    if (!branch) {
      await session.abortTransaction();
      session.endSession();
      return { status: "NOT_FOUND", message: "Branch not found" };
    }

    // Update branch details
    if (branchUpdateData && Object.keys(branchUpdateData).length > 0) {
      // `admin` field should not be updated directly on branch.
      if (branchUpdateData.admin) {
        delete branchUpdateData.admin;
      }
      Object.assign(branch, branchUpdateData);
      await branch.save({ session });
    }

    // Update admin details
    if (adminUpdateData && Object.keys(adminUpdateData).length > 0) {
      if (!branch.admin) {
        await session.abortTransaction();
        session.endSession();
        return {
          status: "BAD_REQUEST",
          message: "Branch does not have an admin to update.",
        };
      }

      const admin = await mongoose
        .model("User")
        .findById(branch.admin)
        .session(session);
      if (!admin) {
        await session.abortTransaction();
        session.endSession();
        return { status: "NOT_FOUND", message: "Admin user not found." };
      }

      Object.assign(admin, adminUpdateData);
      await admin.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const updatedBranchWithAdmin = await Branch.findById(branchId).populate(
      "admin",
      // WARNING: Including password is a security risk. Do not use in production.
      "name email role password"
    );

    return { status: "SUCCESS", data: updatedBranchWithAdmin };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ DELETE BRANCH ------------------
export const deleteBranchById = async (branchId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find branch
    const branch = await Branch.findById(branchId).session(session);
    if (!branch) {
      await session.abortTransaction();
      session.endSession();
      return { status: "NOT_FOUND", message: "Branch not found" };
    }

    // Step 2: Optionally delete associated admin
    if (branch.admin) {
      await mongoose.model("User").findByIdAndDelete(branch.admin, { session });
    }

    // Step 3: Delete branch
    await Branch.findByIdAndDelete(branchId, { session });

    await session.commitTransaction();
    session.endSession();

    return { status: "SUCCESS", data: branch };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ GET ALL BRANCHES ------------------
export const getAllBranches = async () => {
  try {
    const branches = await Branch.find().populate(
      "admin",
      "name email role password"
    );
    return { status: "SUCCESS", data: branches };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ GET BRANCH BY ID ------------------
export const getBranchById = async (branchId) => {
  try {
    const branch = await Branch.findById(branchId).populate(
      "admin",
      // WARNING: Including password is a security risk. Do not use in production.
      "name email role password"
    );
    if (!branch) return { status: "NOT_FOUND", message: "Branch not found" };

    return { status: "SUCCESS", data: branch };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};
