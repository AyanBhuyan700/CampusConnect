import express from "express";
import {
    createDepartment,
    deleteDepartment,
    GetDepartmentByUniversityId,
    updateDepartment
} from "../controllers/Department.js";
import { uploadDep } from "../middleware/upload.js";

const router = express.Router();

router.get("/", GetDepartmentByUniversityId);
router.post("/", uploadDep.single("image"), createDepartment);
router.put("/", uploadDep.single("image"), updateDepartment);
router.delete("/", deleteDepartment);
router.delete("/:id", deleteDepartment);

export default router;
