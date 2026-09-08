import multer from "multer";

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

/**
 * Global Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error("Internal Error:", err);

    // Multer file upload errors
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File too large. Maximum allowed size is 5MB." });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    // Custom upload validation error
    if (err.message && err.message.includes("Only image files")) {
        return res.status(400).json({ message: err.message });
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: "Validation error", errors: messages });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid ID format for ${err.path}` });
    }

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    });
};
