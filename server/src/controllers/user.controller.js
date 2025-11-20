import * as userService from "../services/index.js";
import { sendResponse } from "../utils/index.js";

// ------------------ GET ALL USERS ------------------
export const getAllUsers = async (req, res) => {
  const result = await userService.getAllUsers();

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

// ------------------ GET USER BY ID ------------------
export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(
      res,
      { success: false, message: "id is required" },
      400
    );
  }

  const result = await userService.getUserById(id);

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

// ------------------ DELETE USER BY ID ------------------
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(
      res,
      { success: false, message: "id is required" },
      400
    );
  }

  const result = await userService.deleteUserById(id);

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        { success: true, message: "user deleted successfully" },
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

// ------------------ UPDATE USER BY ID ------------------
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(
      res,
      { success: false, message: "id is required" },
      400
    );
  }
  const updateData = req.body;

  const result = await userService.updateUserById(id, updateData);

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        {
          success: true,
          message: "User updated successfully",
          data: result.data,
        },
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