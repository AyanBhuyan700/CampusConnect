import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const secretKey = process.env.JWT_KEY || 'default_jwt_secret_key';
    return jwt.sign(
        { email: user.email, id: user._id },
        secretKey,
        { expiresIn: '7d' }
    );
};