import Student from "../models/Student.js";

// ------------------ CREATE STUDENT ------------------
export const createStudent = async (studentData) => {
  try {
    const newStudent = await Student.create(studentData);
    return { status: "SUCCESS", data: newStudent };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ GET ALL STUDENTS ------------------
export const getAllStudents = async () => {
  try {
    const students = await Student.find().populate("branch", "name location");
    return { status: "SUCCESS", data: students };
  } catch (error) {
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
    if (!student) return { status: "NOT_FOUND", message: "Student not found" };

    return { status: "SUCCESS", data: student };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ UPDATE STUDENT ------------------
export const updateStudentById = async (studentId, updateData) => {
  try {
    const updated = await Student.findByIdAndUpdate(studentId, updateData, {
      new: true,
    });
    if (!updated) return { status: "NOT_FOUND", message: "Student not found" };

    return { status: "SUCCESS", data: updated };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

// ------------------ DELETE STUDENT ------------------
export const deleteStudentById = async (studentId) => {
  try {
    const deleted = await Student.findByIdAndDelete(studentId);
    if (!deleted) return { status: "NOT_FOUND", message: "Student not found" };
    return { status: "SUCCESS", data: deleted };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};
