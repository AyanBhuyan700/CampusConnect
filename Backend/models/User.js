import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    middlename: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        default: "user"
    },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User