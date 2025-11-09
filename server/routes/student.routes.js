import { Router } from "express";
import * as studentController from "../controllers/index.js";

const router = Router();

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudentById);
router.delete("/:id", studentController.deleteStudentById);

export default router;
