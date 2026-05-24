const jwt = require('jsonwebtoken');

//generate access token that expires in 15 minutes
exports.generateAccessToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"15m"
    });
};

//generate refresh token that expires in 7 days
exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
};