import { User } from "../models/index.js";

export const createUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("User already exists");

  // TODO: WILL DO THAT LATER USING ENCRYPTION AND SECUIRITY
  const user = new User(userData);
  return await user.save();
};

export const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return { status: "SUCCESS", data: users };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { status: "NOT_FOUND", message: "User not found" };
    }
    return { status: "SUCCESS", data: user };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

export const deleteUserById = async (id) => {
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return { status: "NOT_FOUND", message: "user not found" };
    }
    return { status: "SUCCESS" };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};

export const updateUserById = async (id, updateData) => {
  try {
    const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return { status: "NOT_FOUND", message: "User not found" };
    }
    return { status: "SUCCESS", data: updated };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};
