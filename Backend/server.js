import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import universityRoutes from "./routes/universityRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { getCourseDetails } from "./controllers/Course.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Parsing Middlewares
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Static File Serving (maintaining full backward-compatibility with frontend)
app.use(express.static("uploadUniv"));
app.use(express.static("uploadDep"));
app.use(express.static("uploadCrs"));
app.use("/uploadUniv", express.static("uploadUniv"));
app.use("/uploadDep", express.static("uploadDep"));
app.use("/uploadCrs", express.static("uploadCrs"));

// Health Check Endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "CampusConnect Backend API is running",
        timestamp: new Date().toISOString()
    });
});

// Mount Modular API Routes
app.use("/university", universityRoutes);
app.use("/department", departmentRoutes);
app.use("/courses", courseRoutes);
app.get("/coursesDetails", getCourseDetails); // Preserves exact frontend contract
app.use("/", userRoutes); // Mounts /register and /login

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to Database and Start Server
let server;

const startServer = async () => {
    await connectDB();
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

// Graceful Shutdown Management
const handleShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log("HTTP server closed.");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

export default app;
