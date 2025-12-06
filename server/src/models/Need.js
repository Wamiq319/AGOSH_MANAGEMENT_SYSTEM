import mongoose from "mongoose";
const needSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required for the need report."],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Description is required."],
      maxlength: 500,
    },

    quantityOrAmount: {
      type: String,
      required: [true, "Quantity or amount is required."],
      trim: true,
      maxlength: 50,
    },

    branch: {
      type: mongoose.Schema.ObjectId,
      ref: "Branch",
      required: [true, "Need must belong to a branch."],
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "FULFILLED"],
      default: "PENDING",
    },

    fulfilledDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Need = mongoose.model("Need", needSchema);


export default Need;