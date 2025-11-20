import * as studentService from "../services/index.js";
import { sendResponse } from "../utils/index.js";

// ------------------ GET ALL STUDENTS ------------------
export const getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAllStudents();

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(res, { success: true, data: result.data }, 200);

      case "SERVER_ERROR":
        console.error(
          "❌ Student Controller | getAllStudents:",
          result.message
        );
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
    console.error("❌ Controller Crash | getAllStudents:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

// ------------------ GET STUDENT BY ID ------------------
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return sendResponse(
        res,
        { success: false, message: "id is required" },
        400
      );

    const result = await studentService.getStudentById(id);

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
        console.error(
          "❌ Student Controller | getStudentById:",
          result.message
        );
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
    console.error("❌ Controller Crash | getStudentById:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

// ------------------ CREATE STUDENT ------------------
export const createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData)
      return sendResponse(
        res,
        { success: false, message: "student data is required" },
        400
      );

    const result = await studentService.createStudent(studentData);

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

// ------------------ UPDATE STUDENT ------------------
export const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id)
      return sendResponse(
        res,
        { success: false, message: "id is required" },
        400
      );

    const result = await studentService.updateStudentById(id, updateData);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          {
            success: true,
            data: result.data,
            message: "Student updated successfully",
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
        console.error(
          "❌ Student Controller | updateStudentById:",
          result.message
        );
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
    console.error("❌ Controller Crash | updateStudentById:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};

// ------------------ DELETE STUDENT ------------------
export const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return sendResponse(
        res,
        { success: false, message: "id is required" },
        400
      );

    const result = await studentService.deleteStudentById(id);

    switch (result.status) {
      case "SUCCESS":
        return sendResponse(
          res,
          { success: true, message: "Student deleted successfully" },
          200
        );

      case "NOT_FOUND":
        return sendResponse(
          res,
          { success: false, message: result.message },
          404
        );

      case "SERVER_ERROR":
        console.error(
          "❌ Student Controller | deleteStudentById:",
          result.message
        );
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
    console.error("❌ Controller Crash | deleteStudentById:", error);
    return sendResponse(
      res,
      { success: false, message: "Internal Server Error" },
      500
    );
  }
};
