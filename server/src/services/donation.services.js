import Donation from "../models/Donation.js";
import mongoose from "mongoose";

// CREATE DONATION
export const createDonation = async (data) => {
  const donation = await Donation.create(data);
  return {
    status: "SUCCESS",
    data: donation,
  };
};

// UPDATE DONATION
export const updateDonation = async (id, updateData) => {
  const donation = await Donation.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!donation) {
    return { status: "NOT_FOUND", message: "Donation not found" };
  }

  return {
    status: "SUCCESS",
    data: donation,
  };
};

// DELETE DONATION
export const deleteDonation = async (id) => {
  const donation = await Donation.findByIdAndDelete(id);

  if (!donation) {
    return { status: "NOT_FOUND", message: "Donation not found" };
  }

  return {
    status: "SUCCESS",
    message: "Donation deleted successfully",
  };
};

// GET ALL DONATIONS
export const getAllDonations = async () => {
  const donations = await Donation.find()
    .sort({ createdAt: -1 })
    .populate("donor", "name email")
    .populate("branch", "name");

  return {
    status: "SUCCESS",
    data: donations,
  };
};

// GET SINGLE DONATION
export const getDonationById = async (id) => {
  const donation = await Donation.findById(id)
    .populate("donor", "name email")
    .populate("branch", "name");

  if (!donation) {
    return { status: "NOT_FOUND", message: "Donation not found" };
  }

  return {
    status: "SUCCESS",
    data: donation,
  };
};

// GET DONATIONS BY DONOR
export const getDonationsByDonor = async (donorId) => {
  const donations = await Donation.find({
    donor: new mongoose.Types.ObjectId(donorId),
  })
    .sort({ createdAt: -1 })
    .populate("branch", "name");

  return {
    status: "SUCCESS",
    data: donations,
  };
};

// GET DONATIONS BY BRANCH
export const getDonationsByBranch = async (branchId) => {
  const donations = await Donation.find({
    branch: new mongoose.Types.ObjectId(branchId),
  })
    .sort({ createdAt: -1 })
    .populate("donor", "name email")
    .populate("student");

  return {
    status: "SUCCESS",
    data: donations,
  };
};
