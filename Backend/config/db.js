import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("Error: MONGODB_URI is not defined in environment variables.");
            return;
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB connection lost. Attempting reconnection...");
});

export default connectDB;
