import University from "../models/University.js";
import fs from "fs";
import path from "path";

const uploadPath = path.join("uploadUniv");

export const createUniversity = async (req, res) => {
    try {
        let { name, location, foundedYear, website, ranking } = req.body;
        const univData = await University.create({
            name,
            location,
            foundedYear,
            website,
            ranking,
            image: req?.file?.filename,
        });
        if (univData) {
            res.status(201).send({ message: "University Created" });
        } else {
            res.status(404).send({ message: "Unable to create University" });
        }
    } catch (err) {
        console.log(err.message);
    }
};

export const updateUniversity = async (req, res) => {
    try {
        let { id, name, location, foundedYear, website, ranking } = req.body;
        const existingUniv = await University.findById(id);
        if (!existingUniv) {
            return res.status(404).send({ message: "University not found" });
        }

        // Delete the old image if a new image is provided
        if (req?.file?.filename && existingUniv.image) {
            const oldImagePath = path.join(uploadPath, existingUniv.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedUniv = await University.findByIdAndUpdate(id, {
            name,
            location,
            foundedYear,
            website,
            ranking,
            image: req?.file?.filename || existingUniv.image,
        }, { new: true });

        if (updatedUniv) {
            res.status(200).send({ message: "University Updated" });
        } else {
            res.status(400).send({ message: "Unable to update University" });
        }
    } catch (err) {
        console.log(err.message);
    }
};

export const deleteUniversity = async (req, res) => {
    try {
        const { id } = req.body;
        const existingUniv = await University.findById(id);
        if (!existingUniv) {
            return res.status(404).send({ message: "University not found" });
        }

        // Delete the image file if it exists
        if (existingUniv.image) {
            const imagePath = path.join(uploadPath, existingUniv.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await University.findByIdAndDelete(id);
        res.status(200).send({ message: "University Deleted" });
    } catch (err) {
        console.log(err.message);
    }
};

export const getUniversity = async (req, res) => {
    try {
        const univData = await University.find();
        res.status(200).send({ univData });
    } catch (err) {
        console.log(err.message);
    }
};
