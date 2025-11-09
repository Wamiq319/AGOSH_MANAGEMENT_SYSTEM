import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Common fields for all users
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["HEAD_OFFICE_ADMIN", "BRANCH_ADMIN", "DONOR"],
      required: true,
    },
    isActive: { type: Boolean, default: true },

    // Fields for BRANCH_ADMIN
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    // Fields for DONOR
    address: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
