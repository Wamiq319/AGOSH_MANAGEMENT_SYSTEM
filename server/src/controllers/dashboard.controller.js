import * as dashboardService from "../services/index.js";
import { sendResponse } from "../utils/index.js";
import User from "../models/User.js";

const handleDashboardRequest = async (req, res, serviceCall) => {
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
    console.error("Dashboard controller error:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal server error." },
      500
    );
  }
};

export const getAdminDashboard = (req, res) =>
  handleDashboardRequest(req, res, (user) => {
    if (user.role !== "HEAD_OFFICE_ADMIN") {
      return { status: "FORBIDDEN", message: "Access denied." };
    }
    return dashboardService.getAdminDashboardData();
  });

export const getBranchAdminDashboard = (req, res) =>
  handleDashboardRequest(req, res, (user) => {
    if (user.role !== "BRANCH_ADMIN" || !user.branch) {
      return {
        status: "FORBIDDEN",
        message: "Access denied or branch not assigned.",
      };
    }
    return dashboardService.getBranchAdminDashboardData(user.branch);
  });

export const getDonorDashboard = (req, res) =>
  handleDashboardRequest(req, res, (user) => {
    if (user.role !== "DONOR") {
      return { status: "FORBIDDEN", message: "Access denied." };
    }
    return dashboardService.getDonorDashboardData(user._id);
  });

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
