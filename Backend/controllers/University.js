import University from "../models/University.js";
import { deleteFileIfExists } from "../utils/fileHelper.js";

const UPLOAD_DIR = "uploadUniv";

export const createUniversity = async (req, res, next) => {
    try {
        const { name, location, foundedYear, website, ranking } = req.body;
        const image = req.file ? req.file.filename : "";

        if (!image) {
            return res.status(400).json({ message: "University image is required" });
        }

        const univData = await University.create({
            name,
            location,
            foundedYear: Number(foundedYear),
            website,
            ranking: Number(ranking),
            image,
        });

        return res.status(201).json({ message: "University Created", data: univData });
    } catch (err) {
        // If creation failed but a file was uploaded, clean it up
        if (req.file?.filename) {
            await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
        }
        next(err);
    }
};

export const updateUniversity = async (req, res, next) => {
    try {
        const { id, name, location, foundedYear, website, ranking } = req.body;

        if (!id) {
            return res.status(400).json({ message: "University ID is required" });
        }

        const existingUniv = await University.findById(id);
        if (!existingUniv) {
            // Clean up newly uploaded file if university wasn't found
            if (req.file?.filename) {
                await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
            }
            return res.status(404).json({ message: "University not found" });
        }

        // Asynchronously delete old image if a new image was uploaded
        if (req.file?.filename && existingUniv.image) {
            await deleteFileIfExists(UPLOAD_DIR, existingUniv.image);
        }

        const updatePayload = {
            name: name ?? existingUniv.name,
            location: location ?? existingUniv.location,
            foundedYear: foundedYear !== undefined ? Number(foundedYear) : existingUniv.foundedYear,
            website: website ?? existingUniv.website,
            ranking: ranking !== undefined ? Number(ranking) : existingUniv.ranking,
            image: req.file ? req.file.filename : existingUniv.image,
        };

        const updatedUniv = await University.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({ message: "University Updated", data: updatedUniv });
    } catch (err) {
        if (req.file?.filename) {
            await deleteFileIfExists(UPLOAD_DIR, req.file.filename);
        }
        next(err);
    }
};

export const deleteUniversity = async (req, res, next) => {
    try {
        const id = req.body?.id || req.params?.id;

        if (!id) {
            return res.status(400).json({ message: "University ID is required" });
        }

        const existingUniv = await University.findById(id);
        if (!existingUniv) {
            return res.status(404).json({ message: "University not found" });
        }

        // Non-blocking async image deletion
        if (existingUniv.image) {
            await deleteFileIfExists(UPLOAD_DIR, existingUniv.image);
        }

        await University.findByIdAndDelete(id);
        return res.status(200).json({ message: "University Deleted" });
    } catch (err) {
        next(err);
    }
};

export const getUniversity = async (req, res, next) => {
    try {
        // Use .lean() for fast read without Mongoose document hydration overhead
        const univData = await University.find().sort({ ranking: 1 }).lean();
        return res.status(200).json({ univData });
    } catch (err) {
        next(err);
    }
};
