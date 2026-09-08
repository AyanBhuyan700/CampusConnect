import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * Creates a configured Multer upload instance for a specific directory.
 * - Auto-creates the destination folder if it doesn't exist.
 * - Validates file types to allow only valid images.
 * - Limits file size to 5MB.
 * 
 * @param {string} destinationDir - Directory where uploaded files should be stored
 * @returns {multer.Multer}
 */
export const createUploader = (destinationDir) => {
    // Ensure destination directory exists synchronously on initialization
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationDir);
        },
        filename: (req, file, cb) => {
            const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
            cb(null, `${Date.now()}--${sanitizedName}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        // Accept common image mime types
        const allowedTypes = /jpeg|jpg|png|webp|gif|svg\+xml/;
        const mimeMatch = allowedTypes.test(file.mimetype);
        const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeMatch || extMatch) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (jpeg, jpg, png, webp, gif) are allowed!"), false);
        }
    };

    return multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5 MB max file size
        },
        fileFilter
    });
};

export const uploadUniv = createUploader("uploadUniv");
export const uploadDep = createUploader("uploadDep");
export const uploadCrs = createUploader("uploadCrs");
