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
