import { Router } from "express";
import * as dashboardController from "../controllers/index.js";

const router = Router();

router.get("/admin", dashboardController.getAdminDashboard);
router.get("/branch-admin", dashboardController.getBranchAdminDashboard);
router.get("/donor", dashboardController.getDonorDashboard);

export default router;
