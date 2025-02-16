import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    facultyCount: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "university",
        required: true
    },
}, { timestamps: true });

const Department = mongoose.model("department", departmentSchema);
export default Department;