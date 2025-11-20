import { Router } from "express";
import * as branchController from "../controllers/index.js";

const router = Router();

router.get("/", branchController.getAllBranches);
router.get("/:id", branchController.getBranchById);
router.post("/", branchController.createBranch);
router.put("/:id", branchController.updateBranchById);
router.delete("/:id", branchController.deleteBranchById);

export default router;
