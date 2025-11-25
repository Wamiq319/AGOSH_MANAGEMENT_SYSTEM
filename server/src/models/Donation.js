import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    amount: {
      type: Number,
      required: true,
    },

    receiptImage: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    notes: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["GENERAL", "SPECIFIC_STUDENT"],
      default: "GENERAL",
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-set category
donationSchema.pre("save", function (next) {
  if (this.student) {
    this.category = "SPECIFIC_STUDENT";
  } else {
    this.category = "GENERAL";
  }
  next();
});

export default mongoose.model("Donation", donationSchema);
