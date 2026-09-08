import express from "express";
import {
    createCourse,
    deleteCourse,
    getCourseDetails,
    GetCoursesByDepartmentId,
    updateCourse
} from "../controllers/Course.js";
import { uploadCrs } from "../middleware/upload.js";

const router = express.Router();

router.get("/", GetCoursesByDepartmentId);
router.get("/details", getCourseDetails);
router.get("/:id", getCourseDetails);
router.post("/", uploadCrs.single("image"), createCourse);
router.put("/", uploadCrs.single("image"), updateCourse);
router.delete("/", deleteCourse);
router.delete("/:id", deleteCourse);

export default router;
