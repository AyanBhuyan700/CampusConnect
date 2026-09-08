import Department from '../models/Department.js';
import { deleteFileIfExists } from '../utils/fileHelper.js';

const UPLOAD_DIR = "uploadDep";

export const createDepartment = async (req, res, next) => {
    try {
        const { name, phoneNumber, facultyCount, universityId } = req.body;
        const image = req.file ? req.file.filename : "";

        if (!image) {
            return res.status(400).json({ message: "Department image is required" });
        }

        if (!universityId) {
            return res.status(400).json({ message: "University ID is required" });
        }

        const depData = await Department.create({
            name,
            phoneNumber: Number(phoneNumber),
            facultyCount: Number(facultyCount) || 0,
            image,
            university: universityId
        });

        return res.status(201).json({ message: "Department Created", data: depData });
    } catch (err) {
        if (req.file?.filename) {
            await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
        }
        next(err);
    }
};

export const updateDepartment = async (req, res, next) => {
    try {
        const { id, name, phoneNumber, facultyCount, universityId } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Department ID is required" });
        }

        const existingDep = await Department.findById(id);
        if (!existingDep) {
            if (req.file?.filename) {
                await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
            }
            return res.status(404).json({ message: "Department not found" });
        }

        // Asynchronously delete old image if a new image was uploaded
        if (req.file?.filename && existingDep.image) {
            await deleteFileIfExists(UPLOAD_DIR, existingDep.image);
        }

        const updatePayload = {
            name: name ?? existingDep.name,
            phoneNumber: phoneNumber !== undefined ? Number(phoneNumber) : existingDep.phoneNumber,
            facultyCount: facultyCount !== undefined ? Number(facultyCount) : existingDep.facultyCount,
            image: req.file ? req.file.filename : existingDep.image,
            university: universityId ?? existingDep.university
        };

        const updatedDep = await Department.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({ message: "Department Updated", data: updatedDep });
    } catch (err) {
        if (req.file?.filename) {
            await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
        }
        next(err);
    }
};

export const deleteDepartment = async (req, res, next) => {
    try {
        const id = req.body?.id || req.params?.id;

        if (!id) {
            return res.status(400).json({ message: "Department ID is required" });
        }

        const depData = await Department.findById(id);
        if (!depData) {
            return res.status(404).json({ message: "Department not found" });
        }

        if (depData.image) {
            await deleteFileIfExists(UPLOAD_DIR, depData.image);
        }

        await Department.deleteOne({ _id: id });
        return res.status(200).json({ message: "Department Deleted" });
    } catch (err) {
        next(err);
    }
};

export const GetDepartmentByUniversityId = async (req, res, next) => {
    try {
        const { universityId } = req.query;

        if (!universityId) {
            return res.status(400).json({ message: "universityId query parameter is required" });
        }

        // Leverage indexed university field and .lean() for fast query execution
        const depData = await Department.find({ university: universityId })
            .populate("university")
            .lean();

        if (depData.length > 0) {
            return res.status(200).json({ depData });
        } else {
            return res.status(404).json({ message: "No departments found for this university", depData: [] });
        }
    } catch (err) {
        next(err);
    }
};
