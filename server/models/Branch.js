import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);