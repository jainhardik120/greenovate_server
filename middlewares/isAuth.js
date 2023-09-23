const jwt = require("jsonwebtoken");

const isAuthorized = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        next(error)
    }
    if (!decodedToken) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    req.orgId = decodedToken.userId;
    next();
}

module.exports = isAuthorized;