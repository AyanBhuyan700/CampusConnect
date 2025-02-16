import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
    try {
        let { firstname, middlename, lastname, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    const newUser = await User.create({
                        firstname,
                        middlename,
                        lastname,
                        email,
                        password: hash
                    });
                    let token = generateToken(newUser);
                    res.cookie('token', token);
                    res.send(newUser)
                });
            });
        }
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        else {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let token = generateToken(user);
                    res.cookie('token', token);
                    res.send({ id: user._id, role: user.role })
                }
                else {
                    res.status(400).json({ message: 'Invalid email or password' });
                }
            });
        }
    } catch (err) {
        console.log(err.message);

    }
};
