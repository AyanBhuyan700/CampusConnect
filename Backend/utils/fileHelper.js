import fs from "fs/promises";
import path from "path";

/**
 * Safely deletes a file asynchronously without blocking the event loop.
 * Suppresses ENOENT (file not found) errors gracefully.
 * 
 * @param {string} directory - Base directory where the file resides
 * @param {string} filename - Name of the file to delete
 */
export const deleteFileIfExists = async (directory, filename) => {
    if (!filename) return;

    try {
        const filePath = path.join(directory, filename);
        await fs.unlink(filePath);
    } catch (err) {
        // Ignore if file doesn't exist
        if (err.code !== "ENOENT") {
            console.error(`Failed to delete file ${filename}:`, err.message);
        }
    }
};
