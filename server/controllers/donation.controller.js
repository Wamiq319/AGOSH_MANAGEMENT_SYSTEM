import * as donationService from "../services/index.js";
import { sendResponse } from "../utils/index.js";
import User from "../models/User.js";

const handleDonationRequest = async (req, res, serviceCall) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Authentication required. User ID missing.",
        },
        401
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(
        res,
        { success: false, message: "User not found." },
        404
      );
    }

    const result = await serviceCall(user);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(res, { success: true, data: result.data }, 200);
      case "NOT_FOUND":
        return sendResponse(
          res,
          { success: false, message: result.message },
          404
        );
      case "FORBIDDEN":
        return sendResponse(
          res,
          { success: false, message: result.message },
          403
        );
      default:
        return sendResponse(
          res,
          { success: false, message: result.message || "Server error." },
          500
        );
    }
  } catch (error) {
    console.error("Donation controller error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

//
// ------------------------- CONTROLLER FUNCTIONS -------------------------
//

export const createDonation = (req, res) =>
  handleDonationRequest(req, res, (user) => {
    if (user.role !== "DONOR") {
      return {
        status: "FORBIDDEN",
        message: "Only donors can create donations.",
      };
    }

    const data = {
      donor: user._id,
      branch: req.body.branch,
      amount: req.body.amount,
      transactionId: req.body.transactionId,
      receiptImage: req.file?.path || req.body.receiptImage,
      notes: req.body.notes || "",
    };

    return donationService.createDonation(data);
  });

export const updateDonation = (req, res) =>
  handleDonationRequest(req, res, (user) => {
    if (user.role !== "HEAD_OFFICE_ADMIN" && user.role !== "BRANCH_ADMIN") {
      return { status: "FORBIDDEN", message: "Access denied." };
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.receiptImage = req.file.path;
    }

    return donationService.updateDonation(req.params.id, updateData);
  });

export const deleteDonation = (req, res) =>
  handleDonationRequest(req, res, (user) => {
    if (user.role !== "HEAD_OFFICE_ADMIN") {
      return {
        status: "FORBIDDEN",
        message: "Only head office admins can delete.",
      };
    }

    return donationService.deleteDonation(req.params.id);
  });

export const getAllDonations = (req, res) =>
  handleDonationRequest(req, res, () => {
    return donationService.getAllDonations();
  });

export const getDonationById = (req, res) =>
  handleDonationRequest(req, res, () => {
    return donationService.getDonationById(req.params.id);
  });

export const getDonationsByDonor = (req, res) =>
  handleDonationRequest(req, res, (user) => {
    if (user.role !== "DONOR") {
      return { status: "FORBIDDEN", message: "Donor access only." };
    }

    return donationService.getDonationsByDonor(user._id);
  });

export const getDonationsByBranch = (req, res) =>
  handleDonationRequest(req, res, (user) => {
    if (user.role !== "BRANCH_ADMIN" && user.role !== "HEAD_OFFICE_ADMIN") {
      return { status: "FORBIDDEN", message: "Access denied." };
    }

    return donationService.getDonationsByBranch(req.params.branchId);
  });
