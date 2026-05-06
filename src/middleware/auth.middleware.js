const jwt = require('jsonwebtoken');
const authMiddleware = (req,res,next)=>{
    const authHeader= req.headers.authorization;

    if(!authHeader){
        return res.status(400).json({
            error:"no token provided"
        })
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({ error: "Internal server error" });
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({
            error: "invalid token",
            message: err.message
        });
    }
}
module.exports = authMiddleware;