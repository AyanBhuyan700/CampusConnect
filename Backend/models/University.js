import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "University name is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    foundedYear: {
        type: Number,
        required: [true, "Founded year is required"],
        min: [1000, "Founded year must be at least 1000"]
    },
    website: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "Website is required"],
        match: [/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*)?$/, "Please enter a valid website URL"]
    },
    ranking: {
        type: Number,
        required: [true, "Ranking is required"],
        min: [1, "Ranking must be a positive number"]
    },
    image: {
        type: String,
        required: [true, "Image filename is required"]
    }
}, { timestamps: true });

// Index for sorting and search performance
universitySchema.index({ ranking: 1 });
universitySchema.index({ name: 1 });

const University = mongoose.model("university", universitySchema);
export default University;