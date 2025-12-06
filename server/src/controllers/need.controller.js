import { sendResponse } from "../utils/index.js";
import * as needService from "../services/need.services.js";

export const createNeed = async (req, res) => {
  try {
    const needData = req.body;
    if (!needData)
      return sendResponse(
        res,
        { success: false, message: "Need data is required" },
        400
      );

    const result = await needService.createNeed(needData);
    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          {
            success: true,
            data: result.data,
            message: "Student created successfully",
          },
          201
        );

      case "SERVER_ERROR":
        console.error("❌ Student Controller | createStudent:", result.message);
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
  } catch (error) {
    console.error("❌ Controller Crash | createStudent:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

export const getAllNeeds = async (req, res) => {
  try {
    const result = await needService.getAllNeeds();

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          {
            success: true,
            data: result.data,
            message: "Needs fetched successfully",
          },
          200
        );

      case "SERVER_ERROR":
        console.error("❌ Need Controller | getAllNeeds:", result.message);
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
  } catch (error) {
    console.error("❌ Controller Crash | getAllNeeds:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

export const updateNeedById = async (req, res) => {
  try {
    const needId = req.params.id;
    const updateData = req.body;

    if (!needId) {
      return sendResponse(
        res,
        { success: false, message: "Need ID is required" },
        400
      );
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendResponse(
        res,
        { success: false, message: "Update data is required" },
        400
      );
    }

    const result = await needService.updateNeedById(needId, updateData);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          {
            success: true,
            data: result.data,
            message: "Need updated successfully",
          },
          200
        );

      case "NOT_FOUND":
        return sendResponse(
          res,
          { success: false, message: "Need not found" },
          404
        );

      case "SERVER_ERROR":
        console.error("❌ Need Controller | updateNeedById:", result.message);
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
  } catch (error) {
    console.error("❌ Controller Crash | updateNeedById:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

export const deleteNeedById = async (req, res) => {
  try {
    const needId = req.params.id;

    if (!needId) {
      return sendResponse(
        res,
        { success: false, message: "Need ID is required" },
        400
      );
    }

    const result = await needService.deleteNeedById(needId);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          { success: true, message: "Need deleted successfully" },
          200
        );

      case "NOT_FOUND":
        return sendResponse(
          res,
          { success: false, message: "Need not found" },
          404
        );

      case "SERVER_ERROR":
        console.error("❌ Need Controller | deleteNeedById:", result.message);
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
  } catch (error) {
    console.error("❌ Controller Crash | deleteNeedById:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

export const getNeedByBranchId = async (req, res) => {
  try {
    const BranchId = req.params.id;

    if (!BranchId) {
      return sendResponse(
        res,
        { success: false, message: "Need ID is required" },
        400
      );
    }

    const result = await needService.getNeedByBranchId(BranchId);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          {
            success: true,
            data: result.data,
            message: "Need fetched successfully",
          },
          200
        );

      case "NOT_FOUND":
        return sendResponse(
          res,
          { success: false, message: "Need not found" },
          404
        );

      case "SERVER_ERROR":
        console.error("❌ Need Controller | getNeedById:", result.message);
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
  } catch (error) {
    console.error("❌ Controller Crash | getNeedById:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};
