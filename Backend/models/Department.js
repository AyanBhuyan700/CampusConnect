import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Department name is required"],
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"]
    },
    facultyCount: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "university",
        required: [true, "University reference is required"]
    },
}, { timestamps: true });

// Index foreign key for fast lookups by universityId
departmentSchema.index({ university: 1 });

const Department = mongoose.model("department", departmentSchema);
export default Department;