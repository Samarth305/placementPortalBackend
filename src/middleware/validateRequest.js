const validateRequest = (schema) => {
    return (req,res,next) => {
        try {
            const validateBody = schema.parse(req.body);
            req.body = validateBody;
            next();
        } catch (error) {
            return res.status(400).json({
                error:"Validation failed",
                details: error.issues ? error.issues.map(err=>({
                    field: err.path.join('.'),
                    message: err.message
                })) : error.message
            });
        }
    };
};

module.exports = validateRequest;