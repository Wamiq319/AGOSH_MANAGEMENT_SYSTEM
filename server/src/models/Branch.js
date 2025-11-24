import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentInfo: {
      accountTitle: { type: String, default: "" }, // e.g., charly123
      bankName: { type: String, default: "" }, // e.g., HBL or Easypaisa
      accountNumber: { type: String, default: "" }, // e.g., 0300-1234567 or IBAN
    },
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);
