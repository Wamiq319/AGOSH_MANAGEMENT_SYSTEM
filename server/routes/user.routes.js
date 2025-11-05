import express from "express";
import { AllUserGet, deleteUser, updateUser, UserGetById } from "../controllers/index.js";

const router = express.Router();

router.get("/", AllUserGet);
router.get("/:id", UserGetById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
