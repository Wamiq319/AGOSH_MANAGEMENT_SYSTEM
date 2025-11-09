import * as dashboardService from "../services/index.js";
import { sendResponse } from "../utils/index.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Authentication required. User ID missing in headers.",
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

    const result = await dashboardService.getDashboardData(user);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(res, { success: true, data: result.data }, 200);
      case "FORBIDDEN":
        return sendResponse(
          res,
          { success: false, message: result.message },
          403
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
          { success: false, message: "An unexpected error occurred" },
          500
        );
    }
  } catch (error) {
    console.error("Error in getDashboard controller:", error);
    return sendResponse(
      res,
      { success: false, message: "Server error in getDashboard controller." },
      500
    );
  }
};
