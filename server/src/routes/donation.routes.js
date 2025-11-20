import { Router } from "express";
import * as donationController from "../controllers/index.js";
import { upload } from "../middelwares/upload.js";

const router = Router();

// CREATE Donation (Donor)
router.post(
  "/create",
  upload.single("receiptImage"),
  donationController.createDonation
);

// UPDATE Donation (Admin / Branch Admin)
router.put(
  "/:id",
  upload.single("receiptImage"),
  donationController.updateDonation
);

// DELETE Donation (Head Office Admin)
router.delete("/:id", donationController.deleteDonation);

// GET ALL Donations (Admin)
router.get("/all", donationController.getAllDonations);

// GET Single Donation
router.get("/:id", donationController.getDonationById);

// GET Donations by Donor (Donor)
router.get("/donor/:userId", donationController.getDonationsByDonor);

// GET Donations by Branch (Admin / Branch Admin)
router.get("/branch/:branchId", donationController.getDonationsByBranch);

export default router;
