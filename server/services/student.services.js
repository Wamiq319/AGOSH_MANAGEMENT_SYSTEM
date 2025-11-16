import Student from "../models/Student.js";

// ------------------ CREATE STUDENT ------------------
export const createStudent = async (studentData) => {
  try {
    const newStudent = await Student.create(studentData);
    return { status: "SUCCESS", data: newStudent };
  } catch (error) {
    console.error("❌ Service Crash | createStudent:", error);
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ GET ALL STUDENTS ------------------
export const getAllStudents = async () => {
  try {
    const students = await Student.find().populate("branch", "name location");
    return { status: "SUCCESS", data: students };
  } catch (error) {
    console.error("❌ Service Crash | getAllStudents:", error);
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ GET STUDENT BY ID ------------------
export const getStudentById = async (studentId) => {
  try {
    const student = await Student.findById(studentId).populate(
      "branch",
      "name location"
    );

    if (!student) {
      console.warn(
        "⚠️ Service Warning | getStudentById: Student not found",
        studentId
      );
      return { status: "NOT_FOUND", message: "Student not found" };
    }

    return { status: "SUCCESS", data: student };
  } catch (error) {
    console.error("❌ Service Crash | getStudentById:", error);
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ UPDATE STUDENT ------------------
export const updateStudentById = async (studentId, updateData) => {
  try {
    const updated = await Student.findByIdAndUpdate(studentId, updateData, {
      new: true,
    });

    if (!updated) {
      console.warn(
        "⚠️ Service Warning | updateStudentById: Student not found",
        studentId
      );
      return { status: "NOT_FOUND", message: "Student not found" };
    }

    return { status: "SUCCESS", data: updated };
  } catch (error) {
    console.error("❌ Service Crash | updateStudentById:", error);
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ DELETE STUDENT ------------------
export const deleteStudentById = async (studentId) => {
  try {
    const deleted = await Student.findByIdAndDelete(studentId);

    if (!deleted) {
      console.warn(
        "⚠️ Service Warning | deleteStudentById: Student not found",
        studentId
      );
      return { status: "NOT_FOUND", message: "Student not found" };
    }

    return { status: "SUCCESS", data: deleted };
  } catch (error) {
    console.error("❌ Service Crash | deleteStudentById:", error);
    return { status: "SERVER_ERROR", message: error.message };
  }
};
