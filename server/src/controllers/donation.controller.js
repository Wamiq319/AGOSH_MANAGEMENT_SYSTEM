import * as donationService from "../services/index.js";
import { sendResponse, uploadOnCloudinary } from "../utils/index.js";

//
// ------------------------- CONTROLLER FUNCTIONS -------------------------
//

export const createDonation = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);

  try {
    const data = {
      donor: req.body.donor,
      branch: req.body.branch,
      amount: req.body.amount,
      notes: req.body.notes || "",
    };

    if (req.file) {
      const receiptImage = await uploadOnCloudinary(req.file.path);
      if (!receiptImage) {
        return sendResponse(
          res,
          { success: false, message: "Failed to upload receipt image." },
          400
        );
      }
      data.receiptImage = receiptImage.secure_url;
    } else {
      return sendResponse(
        res,
        { success: false, message: "Receipt image is required." },
        400
      );
    }

    const result = await donationService.createDonation(data);
    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: result.data }, 201);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        400
      );
    }
  } catch (error) {
    console.error("Create donation error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const updateDonation = async (req, res) => {
  console.log("Update Request Body:", req.body);
  console.log("Update Request File:", req.file);

  try {
    const updateData = { ...req.body };
    if (req.file) {
      const receiptImage = await uploadOnCloudinary(req.file.path);
      if (!receiptImage) {
        return sendResponse(
          res,
          { success: false, message: "Failed to upload receipt image." },
          400
        );
      }
      updateData.receiptImage = receiptImage.secure_url;
    }

    const result = await donationService.updateDonation(
      req.params.id,
      updateData
    );
    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: result.data }, 200);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        400
      );
    }
  } catch (error) {
    console.error("Update donation error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const result = await donationService.deleteDonation(req.params.id);
    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: null }, 204);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    }
  } catch (error) {
    console.error("Delete donation error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const result = await donationService.getAllDonations();
    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: result.data }, 200);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        500
      );
    }
  } catch (error) {
    console.error("Get all donations error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const getDonationById = async (req, res) => {
  try {
    const result = await donationService.getDonationById(req.params.id);
    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: result.data }, 200);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    }
  } catch (error) {
    console.error("Get donation by id error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const getDonationsByDonor = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await donationService.getDonationsByDonor(userId);

    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: result.data }, 200);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    }
  } catch (error) {
    console.error("Error fetching donations by donor:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const getDonationsByBranch = async (req, res) => {
  try {
    const result = await donationService.getDonationsByBranch(
      req.params.branchId
    );
    if (result.status === "SUCCESS") {
      return sendResponse(res, { success: true, data: result.data }, 200);
    } else {
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    }
  } catch (error) {
    console.error("Get donations by branch error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};
