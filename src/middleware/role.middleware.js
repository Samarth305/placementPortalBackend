const jwt = require('jsonwebtoken');

const roleMiddleware = (...allowedRoles)=>{
    return (req,res,next)=>{
        try {
            const userRole=req.user.role;

            //if the role is present
            if(!userRole){
                return res.status(401).json({
                    error : "role missing in token"
                });
            }

            //included in the allowedRoles
            if(!allowedRoles.includes(userRole)){
                return res.status(403).json({
                    error:"not authorised"
                });
            }

            //allowed for that role
            next();
        } catch (err) {
            return res.status(500).json({
                error:err.message
            });
        }
    };
};

module.exports = roleMiddleware;