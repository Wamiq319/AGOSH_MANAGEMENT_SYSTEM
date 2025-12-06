import express from "express";
import * as needController from "../controllers/index.js";

const router = express.Router();

router.post("/", needController.createNeed);
router.get("/", needController.getAllNeeds);
// router.get("/:id", needController.getNeedById);
router.put("/:id", needController.updateNeedById);
// router.delete("/:id", needController.deleteNeedById);
export default router;