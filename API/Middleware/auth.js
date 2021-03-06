const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.jwtKey);
        req.user = decodedToken;
        req.user.token = token;
        next();
    } catch (error) {
        return res.status(401).send({
            message: 'Auth failed'
        });
    }
}