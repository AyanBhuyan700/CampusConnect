import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const registerUser = async (req, res, next) => {
    try {
        const { firstname, middlename, lastname, email, password } = req.body;

        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ message: 'Firstname, lastname, email, and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Modern async bcrypt hash (10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname: firstname.trim(),
            middlename: middlename ? middlename.trim() : "",
            lastname: lastname.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = generateToken(newUser);
        res.cookie('token', token, COOKIE_OPTIONS);

        // Omit hashed password from response for security
        const userResponse = newUser.toJSON();

        return res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Modern async bcrypt compare
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({
            message: 'Login successful',
            id: user._id,
            role: user.role
        });
    } catch (err) {
        next(err);
    }
};
