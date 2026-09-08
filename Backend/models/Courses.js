import mongoose from 'mongoose';

const CoursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        trim: true
    },
    code: {
        type: String,
        required: [true, "Course code is required"],
        unique: true,
        uppercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    duration: {
        type: Number, // Duration in weeks
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 week"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department",
        required: [true, "Department reference is required"]
    }
}, { timestamps: true });

// Index foreign key for fast lookups by departmentId
CoursesSchema.index({ department: 1 });

const Courses = mongoose.model("courses", CoursesSchema);
export default Courses;