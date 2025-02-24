import Courses from "../models/Courses.js";
import fs from "fs";
import path from "path";

const uploadPath = path.join("uploadCrs"); // Folder for storing images

export const createCourse = async (req, res) => {
    try {
        let image = req?.file?.filename || ""; // Single image
        let { name, code, duration, price, description, departmentId } = req.body;

        const crsData = await Courses.create({
            name,
            code,
            duration,
            price,
            description,
            image,
            department: departmentId
        });

        if (crsData) {
            res.status(200).send({ message: "Course Created" });
        } else {
            res.status(401).send({ message: "Unable to create course" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const updateCourse = async (req, res) => {
    try {
        let image = req?.file?.filename || "";
        let { id, name, code, duration, price, description, departmentId } = req.body;

        const existingCourse = await Courses.findById(id);
        if (!existingCourse) {
            return res.status(404).send({ message: "Course not found" });
        }

        // Delete old image if a new one is uploaded
        if (image && existingCourse.image) {
            const oldImagePath = path.join(uploadPath, existingCourse.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedCourse = await Courses.findByIdAndUpdate(
            id,
            {
                name,
                code,
                duration,
                price,
                description,
                image: image || existingCourse.image, // Keep old image if no new one
                department: departmentId
            },
            { new: true }
        );

        if (updatedCourse) {
            res.status(200).send({ message: "Course Updated" });
        } else {
            res.status(401).send({ message: "Unable to update course" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.body;
        const crsData = await Courses.findById(id);

        if (!crsData) {
            return res.status(404).send({ message: "Course not found" });
        }

        // Delete image if it exists
        if (crsData.image) {
            const imagePath = path.join(uploadPath, crsData.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Courses.deleteOne({ _id: id });

        res.status(200).send({ message: "Course Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const GetCoursesByDepartmentId = async (req, res) => {
    try {
        const { departmentId } = req.query;
        const crsData = await Courses.find({ department: departmentId }).populate({
            path: "department",
            populate: [{ path: "university" }]
        });

        if (crsData.length > 0) {
            res.status(200).send({ crsData });
        } else {
            res.status(404).send({ message: "No courses found for this department" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.query;
        const crsData = await Courses.findOne({ _id: id }).populate({
            path: "department",
            populate: [{ path: "university" }]
        });

        if (crsData) {
            res.status(200).send({ crsData });
        } else {
            res.status(404).send({ message: "Course not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

