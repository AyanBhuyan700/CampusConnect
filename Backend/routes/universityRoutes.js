import express from "express";
import {
    createUniversity,
    deleteUniversity,
    getUniversity,
    updateUniversity
} from "../controllers/University.js";
import { uploadUniv } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getUniversity);
router.post("/", uploadUniv.single("image"), createUniversity);
router.put("/", uploadUniv.single("image"), updateUniversity);
router.delete("/", deleteUniversity);
router.delete("/:id", deleteUniversity); // support both req.body.id and req.params.id

export default router;
