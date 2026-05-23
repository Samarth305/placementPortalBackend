const rateLimit = require('express-rate-limit');

//general api limit
exports.apiLimiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:{ error: "Too many requests from this IP, please try again after 15 minutes."},
    standardHeaders:true, //Return rate limit info in the `RateLimit-*` headers
    legacyHeaders:false, //Disable `X-RateLimit-*` headers
});

//auth login/signup failed attempts
exports.loginLimiter = rateLimit({
    windowMs:15*60*1000,
    max:20,
    message:{ error: "Too many requests from this IP, please try again after 15 minutes."},
    standardHeaders:true, //Return rate limit info in the `RateLimit-*` headers
    legacyHeaders:false, //Disable `X-RateLimit-*` headers
})