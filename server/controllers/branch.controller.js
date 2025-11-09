import * as branchService from "../services/index.js";
import { sendResponse } from "../utils/index.js";

// ------------------ GET ALL BRANCHES ------------------
export const getAllBranches = async (req, res) => {
  const result = await branchService.getAllBranches();

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(res, { success: true, data: result.data }, 200);
    case "SERVER_ERROR":
      return sendResponse(
        res,
        { success: false, message: result.message },
        500
      );
    default:
      return sendResponse(
        res,
        { success: false, message: "Unexpected error occurred" },
        500
      );
  }
};

// ------------------ GET BRANCH BY ID ------------------
export const getBranchById = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return sendResponse(
      res,
      { success: false, message: "id is required" },
      400
    );

  const result = await branchService.getBranchById(id);

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(res, { success: true, data: result.data }, 200);
    case "NOT_FOUND":
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    case "SERVER_ERROR":
      return sendResponse(
        res,
        { success: false, message: result.message },
        500
      );
    default:
      return sendResponse(
        res,
        { success: false, message: "Unexpected error occurred" },
        500
      );
  }
};

// ------------------ CREATE BRANCH (optionally with admin) ------------------
export const createBranch = async (req, res) => {
  const { branch, admin } = req.body;
  if (!branch)
    return sendResponse(
      res,
      { success: false, message: "branch data is required" },
      400
    );

  const result = await branchService.createBranch(branch, admin);

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        {
          success: true,
          data: result.data,
          message: "Branch created successfully",
        },
        201
      );
    case "SERVER_ERROR":
      return sendResponse(
        res,
        { success: false, message: result.message },
        500
      );
    default:
      return sendResponse(
        res,
        { success: false, message: "Unexpected error occurred" },
        500
      );
  }
};

// ------------------ UPDATE BRANCH BY ID ------------------
export const updateBranchById = async (req, res) => {
  const { id } = req.params;
  const { branch, admin } = req.body;

  if (!id)
    return sendResponse(
      res,
      { success: false, message: "id is required" },
      400
    );

  if (!branch && !admin) {
    return sendResponse(
      res,
      {
        success: false,
        message: "branch or admin data is required for update",
      },
      400
    );
  }

  const result = await branchService.updateBranchById(id, { branch, admin });

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        {
          success: true,
          data: result.data,
          message: "Branch updated successfully",
        },
        200
      );
    case "NOT_FOUND":
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    case "BAD_REQUEST":
      return sendResponse(
        res,
        { success: false, message: result.message },
        400
      );
    case "SERVER_ERROR":
      return sendResponse(
        res,
        { success: false, message: result.message },
        500
      );
    default:
      return sendResponse(
        res,
        { success: false, message: "Unexpected error occurred" },
        500
      );
  }
};

// ------------------ DELETE BRANCH BY ID ------------------
export const deleteBranchById = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return sendResponse(
      res,
      { success: false, message: "id is required" },
      400
    );

  const result = await branchService.deleteBranchById(id);

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        { success: true, message: "Branch deleted successfully" },
        200
      );
    case "NOT_FOUND":
      return sendResponse(
        res,
        { success: false, message: result.message },
        404
      );
    case "SERVER_ERROR":
      return sendResponse(
        res,
        { success: false, message: result.message },
        500
      );
    default:
      return sendResponse(
        res,
        { success: false, message: "Unexpected error occurred" },
        500
      );
  }
};
