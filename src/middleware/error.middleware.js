const CustomError = require('../utils/CustomError');

const errorHandler = (err,req,res,next) => {
    console.error(`[ERROR] ${err.message}`);
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({
            error:err.message
        });
    }

    // If it's a Prisma Database Error (e.g. Unique constraint failed)
    if (err.code === 'P2002') {
        return res.status(400).json({ error: "A record with this data already exists." });
    }

    return res.status(500).json({ 
        error: "Internal Server Error", 
        // Only show detailed crash logs if we are running in development mode
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
};

module.exports = errorHandler;