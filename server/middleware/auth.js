const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
       console.error("❌ No token provided in request.");
       return res.status(401).json({ message: "No token provided" });
     }
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'No token, Access Denied'
        })
        console.log("No token, Access Denied");
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