import * as authService from "../services/index.js";
import { sendResponse } from "../utils/index.js";

// ------------------ REGISTER ------------------
export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    department,
    rollNo,
    profile,
    address,
    phoneNumber,
  } = req.body;

  if (!name || !email || !password || !role)
    return sendResponse(
      res,
      { success: false, message: "All fields are required" },
      400
    );

  const result = await authService.registerUser({
    name,
    email,
    password,
    role,
    department,
    rollNo,
    profile,
    address,
    phoneNumber,
  });

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        {
          success: true,
          message: "User registered successfully",
          data: result.data,
        },
        201
      );
    case "CONFLICT":
      return sendResponse(
        res,
        { success: false, message: result.message },
        409
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
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return sendResponse(
      res,
      { success: false, message: "Email and password are required" },
      400
    );

  const result = await authService.loginUser(email, password);

  switch (result.status) {
    case "SUCCESS":
      return sendResponse(
        res,
        {
          success: true,
          message: "Login successful",
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
    case "UNAUTHORIZED":
      return sendResponse(
        res,
        { success: false, message: result.message },
        401
      );
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
};