import { User } from "../models/index.js";

// Register new user
export const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return { status: "CONFLICT", message: "User already exists" };
    }

    const user = new User(userData);
    const savedUser = await user.save();
    return { status: "SUCCESS", data: savedUser };
  } catch (error) {
    console.log(error.message);
    return { status: "SERVER_ERROR", message: "Internal server error" };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: "NOT_FOUND", message: "User not found" };
    }

    if (user.password !== password) {
      return { status: "UNAUTHORIZED", message: "Invalid credentials" };
    }

    if (!user.isActive) {
      return { status: "FORBIDDEN", message: "Account is deactivated" };
    }

    return { status: "SUCCESS", data: user };
  } catch (error) {
    return { status: "SERVER_ERROR", message: error.message };
  }
};
