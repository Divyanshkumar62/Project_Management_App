module.exports = function checkRole(allowedRoles = []){
    return (req, res, next) => {
        if(!req.user || !req.user.role){
            return res.status(401).json({
                msg: "No user role found, Unauthorized!"
            })
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                msg: "Access Denied. Insufficient permission!"
            })
        }
        next();
    }
}