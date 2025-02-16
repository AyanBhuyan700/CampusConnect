import Department from '../models/Department.js';
import fs from 'fs';
import path from 'path';

const uploadPath = path.join("uploadDep"); // Adjust this based on your actual upload folder

export const createDepartment = async (req, res) => {
    try {
        let { name, phoneNumber, facultyCount, universityId } = req.body;
        const depData = await Department.create({
            name,
            phoneNumber,
            facultyCount,
            image: req?.file?.filename,
            university: universityId
        });

        if (depData) {
            res.status(200).send({ message: "Department Created" });
        } else {
            res.status(401).send({ message: "Unable to create department" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        let { id, name, phoneNumber, facultyCount, universityId } = req.body;
        const existingDep = await Department.findById(id);

        if (!existingDep) {
            return res.status(404).send({ message: "Department not found" });
        }

        // If a new image is uploaded, delete the old one
        if (req.file && existingDep.image) {
            const oldImagePath = path.join(uploadPath, existingDep.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedDep = await Department.findByIdAndUpdate(
            id,
            {
                name,
                phoneNumber,
                facultyCount,
                image: req?.file?.filename || existingDep.image, // Keep old image if no new one
                university: universityId
            },
            { new: true }
        );

        if (updatedDep) {
            res.status(200).send({ message: "Department Updated" });
        } else {
            res.status(401).send({ message: "Unable to update department" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.body;
        const depData = await Department.findById(id);

        if (!depData) {
            return res.status(404).send({ message: "Department not found" });
        }

        // Delete the image if it exists
        if (depData.image) {
            const imagePath = path.join(uploadPath, depData.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Department.deleteOne({ _id: id });

        res.status(200).send({ message: "Department Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const GetDepartmentByUniversityId = async (req, res) => {
    try {
        const { universityId } = req.query;
        const depData = await Department.find({ university: universityId }).populate("university");

        if (depData.length > 0) {
            res.status(200).send({ depData });
        } else {
            res.status(404).send({ message: "No departments found for this university" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
