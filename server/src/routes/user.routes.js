import express from "express";
import {
  getAllUsers,
  deleteUserById,
  updateUserById,
  getUserById,
} from "../controllers/index.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
