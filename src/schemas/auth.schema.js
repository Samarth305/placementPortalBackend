const {z} = require("zod");

exports.loginSchema = z.object({
    email:z.string().email({
        message:"provide a valid email address"
    }),
    password:z.string().min(6,{message:"password must be at least 6 characters long"})
});


exports.studentSignupSchema = z.object({
    name:z.string().min(3,{
        message:"Name must be at least 3 characters long"
    }),
    email:z.string().email({
        message:"provide a valid email address"
    }),
    password:z.string().min(6,{
        message:"password must be at least 6 characters long"
    }),
    cgpa:z.number().min(0).max(10).or(z.string().transform(val => parseFloat(val))),
    institute:z.string().min(2, { message: "Institute name is required" }),
    dept:z.string().min(2, { message: "Department is required" }),
    phone:z.string().optional()
});

exports.companySignupSchema = z.object({
    name: z.string().min(2, { message: "Company name is required" }),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    location: z.string().optional(),
    description: z.string().optional()
});

exports.adminSignupSchema = z.object({
    name: z.string().min(2, { message: "Admin name is required" }),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});