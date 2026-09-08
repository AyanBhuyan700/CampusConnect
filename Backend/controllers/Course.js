import Courses from "../models/Courses.js";
import { deleteFileIfExists } from "../utils/fileHelper.js";

const UPLOAD_DIR = "uploadCrs";

export const createCourse = async (req, res, next) => {
    try {
        const image = req.file ? req.file.filename : "";
        const { name, code, duration, price, description, departmentId } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Course image is required" });
        }

        if (!departmentId) {
            return res.status(400).json({ message: "Department ID is required" });
        }

        const crsData = await Courses.create({
            name,
            code,
            duration: Number(duration),
            price: Number(price),
            description,
            image,
            department: departmentId
        });

        return res.status(201).json({ message: "Course Created", data: crsData });
    } catch (err) {
        if (req.file?.filename) {
            await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
        }
        next(err);
    }
};

export const updateCourse = async (req, res, next) => {
    try {
        const { id, name, code, duration, price, description, departmentId } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const existingCourse = await Courses.findById(id);
        if (!existingCourse) {
            if (req.file?.filename) {
                await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
            }
            return res.status(404).json({ message: "Course not found" });
        }

        // Delete old image asynchronously if a new one is provided
        if (req.file?.filename && existingCourse.image) {
            await deleteFileIfExists(UPLOAD_DIR, existingCourse.image);
        }

        const updatePayload = {
            name: name ?? existingCourse.name,
            code: code ?? existingCourse.code,
            duration: duration !== undefined ? Number(duration) : existingCourse.duration,
            price: price !== undefined ? Number(price) : existingCourse.price,
            description: description ?? existingCourse.description,
            image: req.file ? req.file.filename : existingCourse.image,
            department: departmentId ?? existingCourse.department
        };

        const updatedCourse = await Courses.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({ message: "Course Updated", data: updatedCourse });
    } catch (err) {
        if (req.file?.filename) {
            await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
        }
        next(err);
    }
};

export const deleteCourse = async (req, res, next) => {
    try {
        const id = req.body?.id || req.params?.id;

        if (!id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const crsData = await Courses.findById(id);
        if (!crsData) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (crsData.image) {
            await deleteFileIfExists(UPLOAD_DIR, crsData.image);
        }

        await Courses.deleteOne({ _id: id });
        return res.status(200).json({ message: "Course Deleted" });
    } catch (err) {
        next(err);
    }
};

export const GetCoursesByDepartmentId = async (req, res, next) => {
    try {
        const { departmentId } = req.query;

        if (!departmentId) {
            return res.status(400).json({ message: "departmentId query parameter is required" });
        }

        // Use indexed department field and .lean() for fast read with deep population
        const crsData = await Courses.find({ department: departmentId })
            .populate({
                path: "department",
                populate: [{ path: "university" }]
            })
            .lean();

        if (crsData.length > 0) {
            return res.status(200).json({ crsData });
        } else {
            return res.status(404).json({ message: "No courses found for this department", crsData: [] });
        }
    } catch (err) {
        next(err);
    }
};

export const getCourseDetails = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const crsData = await Courses.findById(id)
            .populate({
                path: "department",
                populate: [{ path: "university" }]
            })
            .lean();

        if (crsData) {
            return res.status(200).json({ crsData });
        } else {
            return res.status(404).json({ message: "Course not found" });
        }
    } catch (err) {
        next(err);
    }
};
