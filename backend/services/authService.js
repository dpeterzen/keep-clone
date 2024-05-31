const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        email: user.id,
        username: user.username
    };
    const secretKey = process.env.JWT_SECRET || 'your-default-secret';
    const options = {
        expiresIn: '24h'
    };
    return jwt.sign(payload, secretKey, options);
};

module.exports = { generateToken };