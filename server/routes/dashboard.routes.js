import { Router } from "express";
import * as dashboardController from "../controllers/index.js";
// import { authMiddleware, roleCheck } from "../middlewares"; // Example middleware

const router = Router();

// Add your authentication and role-checking middleware here
// This is a protected route, accessible only by admins
router.get(
  "/",
  // authMiddleware,
  // roleCheck(["HEAD_OFFICE_ADMIN", "BRANCH_ADMIN"]),
  dashboardController.getDashboard
);

export default router;
