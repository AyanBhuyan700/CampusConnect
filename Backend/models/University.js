import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    foundedYear: {
        type: Number,
        required: true,
        min: 1000
    },
    website: {
        type: String,
        lowercase: true,
        required: true,
        match: [/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*)?$/, "Please enter a valid email"]
    },
    ranking: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

const University = mongoose.model("university", universitySchema);
export default University;