import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import multer from "multer";
import { createUniversity, deleteUniversity, getUniversity, updateUniversity } from "./controllers/University.js";
import { createDepartment, deleteDepartment, GetDepartmentByUniversityId, updateDepartment } from "./controllers/Department.js";
import { createCourse, deleteCourse, getCourseDetails, GetCoursesByDepartmentId, updateCourse } from "./controllers/Course.js";
import { loginUser, registerUser } from "./controllers/User.js";
const app = express();
dotenv.config()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(express.static("uploadUniv"))
app.use(express.static("uploadDep"))
app.use(express.static("uploadCrs"))

app.get("/", (req, res) => {
    res.send("hello world")
})

//University Module
const storageUniv = multer.diskStorage({
    destination: 'uploadUniv/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    }
})
const uploadUniv = multer({ storage: storageUniv });

try {
    app.post("/university", uploadUniv.single("image"), createUniversity)
    app.put("/university", uploadUniv.single("image"), updateUniversity)
    app.delete("/university", deleteUniversity)
    app.get("/university", getUniversity)
} catch (err) {
    console.log(err.message);
}

//Department Module
const storageDep = multer.diskStorage({
    destination: 'uploadDep/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    }
})
const uploadDep = multer({ storage: storageDep });

try {
    app.post("/department", uploadDep.single("image"), createDepartment)
    app.put("/department", uploadDep.single("image"), updateDepartment)
    app.delete("/department", deleteDepartment)
    app.get("/department", GetDepartmentByUniversityId)
} catch (err) {
    console.log(err.message);
}

//Course Module
const storageCrs = multer.diskStorage({
    destination: 'uploadCrs/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    }
})
const uploadCrs = multer({ storage: storageCrs });

try {
    app.post("/courses", uploadCrs.single("image"), createCourse)
    app.put("/courses", uploadCrs.single("image"), updateCourse)
    app.delete("/courses", deleteCourse)
    app.get("/courses", GetCoursesByDepartmentId)
    app.get("/coursesDetails", getCourseDetails)
} catch (err) {
    console.log(err.message);
}

//Login and Register Module
try {
    app.post("/register", registerUser)
    app.post("/login", loginUser)
} catch (err) {
    console.log(err.message);

}

//Database Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected");
    app.listen(process.env.PORT)
}).catch((err) => {
    console.log(err.message);

})
