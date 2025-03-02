const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'No token, Access Denied'
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err){
        return res.status(401).json({
            success: false,
            message: 'Invalid Token'
        })
    }
}