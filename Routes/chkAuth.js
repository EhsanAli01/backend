const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, "This is top secret");
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Access Deined"
        })
    }
}