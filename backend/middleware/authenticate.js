// middleware/authenticate.js
const jwt = require('jsonwebtoken');

// This gets called everytime an endpoint is authenticated
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer TOKEN_STRING

    if (!token) {
        return res.sendStatus(401);  // No token provided
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);  // Invalid token
        }
        console.log(" authenticate.js --> user:", user);
        req.user = user;
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
