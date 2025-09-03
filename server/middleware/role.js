module.exports = function checkRole(allowedRoles = []){
    return (req, res, next) => {
        console.log('🔍 Role Check Debug:', {
            userRole: req.user?.role,
            allowedRoles,
            userId: req.user?.id,
            route: req.route?.path,
            method: req.method
        });
        
        if(!req.user || !req.user.role){
            console.log('❌ No user role found');
            return res.status(401).json({
                msg: "No user role found, Unauthorized!"
            })
        }
        
        // Convert both user role and allowed roles to lowercase for comparison
        const userRole = req.user.role.toLowerCase();
        const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());
        
        if(!allowedRolesLower.includes(userRole)){
            console.log('❌ Role not allowed:', req.user.role, 'not in', allowedRoles);
            return res.status(403).json({
                msg: "Access Denied. Insufficient permission!"
            })
        }
        console.log('✅ Role check passed');
        next();
    }
}
