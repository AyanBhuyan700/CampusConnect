import mongoose from 'mongoose'

const CoursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Duration in weeks
        required: true
    },
    image: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department",
        required: true
    }
}, { timestamps: true })

const Courses = mongoose.model("courses", CoursesSchema);
export default Courses;