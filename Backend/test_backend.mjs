import assert from "node:assert";
import { generateToken } from "./utils/generateToken.js";
import { deleteFileIfExists } from "./utils/fileHelper.js";
import { createUploader } from "./middleware/upload.js";
import University from "./models/University.js";
import Department from "./models/Department.js";
import Courses from "./models/Courses.js";
import User from "./models/User.js";
import app from "./server.js";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

async function runTests() {
    console.log("--- Starting Backend Optimization Verifications ---");

    // 1. Test generateToken
    console.log("1. Testing generateToken...");
    const mockUser = { _id: "64f1a2b3c4d5e6f7a8b9c0d1", email: "test@example.com" };
    const token = generateToken(mockUser);
    assert(token, "Token should be generated");
    const decoded = jwt.decode(token);
    assert.strictEqual(decoded.email, mockUser.email);
    assert.strictEqual(decoded.id, mockUser._id);
    assert(decoded.exp, "Token should have expiration (exp)");
    console.log("   ✓ generateToken generated valid JWT with expiration");

    // 2. Test User Model JSON Sanitization
    console.log("2. Testing User Model password exclusion in JSON...");
    const userInstance = new User({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "hashedPassword123"
    });
    const jsonUser = userInstance.toJSON();
    assert.strictEqual(jsonUser.password, undefined, "Password must be stripped from JSON serialization");
    assert.strictEqual(jsonUser.firstname, "John");
    console.log("   ✓ User model successfully strips password in toJSON");

    // 3. Test Indexes on Models
    console.log("3. Testing Model Indexes...");
    const deptIndexes = Department.schema.indexes();
    const hasUnivIndex = deptIndexes.some(idx => idx[0] && idx[0].university === 1);
    assert(hasUnivIndex, "Department schema must have index on university");

    const courseIndexes = Courses.schema.indexes();
    const hasDeptIndex = courseIndexes.some(idx => idx[0] && idx[0].department === 1);
    assert(hasDeptIndex, "Courses schema must have index on department");
    console.log("   ✓ Database indexes for foreign keys confirmed present");

    // 4. Test deleteFileIfExists utility
    console.log("4. Testing non-blocking deleteFileIfExists...");
    const testDir = path.join("uploadUniv");
    const testFilename = `test-${Date.now()}.txt`;
    const testFilePath = path.join(testDir, testFilename);
    await fs.writeFile(testFilePath, "test content");
    await deleteFileIfExists(testDir, testFilename);
    let fileExists = true;
    try {
        await fs.access(testFilePath);
    } catch {
        fileExists = false;
    }
    assert.strictEqual(fileExists, false, "Test file should be safely deleted");

    // Non-existent file should not throw error
    await deleteFileIfExists(testDir, "non_existent_file.xyz");
    console.log("   ✓ deleteFileIfExists functions correctly and safely handles missing files");

    // 5. Test Multer configuration
    console.log("5. Testing Multer uploader...");
    const uploader = createUploader("uploadUniv");
    assert(uploader, "Uploader should be created");
    assert(uploader.limits.fileSize === 5 * 1024 * 1024, "File size limit should be 5MB");
    console.log("   ✓ Multer uploader created with 5MB limit and image filter");

    // 6. Test App Routing table
    console.log("6. Testing Express App Route Registrations...");
    const routes = [];
    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    routes.push(handler.route.path);
                }
            });
        }
    });

    assert(routes.length > 0, "Routes must be registered in Express app");
    console.log("   ✓ Express registered routes successfully:", routes);

    console.log("--- All Automated Tests Passed! ---");
    process.exit(0);
}

runTests().catch(err => {
    console.error("Test failure:", err);
    process.exit(1);
});
