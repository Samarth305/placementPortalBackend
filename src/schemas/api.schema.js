const { z } = require("zod");

// Company Job Schemas
exports.postJobSchema = z.object({
    role: z.string().min(2, { message: "Role is required" }),
    jdUrl: z.string().url({ message: "Valid Job Description URL is required" }).optional().or(z.literal('')),
    ctc: z.string().min(1, { message: "CTC is required" }),
    deadline: z.string().min(1, { message: "Deadline is required" })
});

exports.editJobSchema = z.object({
    role: z.string().min(2).optional(),
    jdUrl: z.string().url().optional().or(z.literal('')),
    ctc: z.string().min(1).optional(),
    deadline: z.string().optional()
});

exports.updateApplicantStatusSchema = z.object({
    status: z.enum(["PENDING", "SHORTLISTED", "REJECTED", "HIRED"], { message: "Invalid applicant status" })
});

// Admin Schemas
exports.updateCompanyStatusSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], { message: "Invalid company status" })
});

// Student Schemas
exports.updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    cgpa: z.number().or(z.string()).optional(),
    dept: z.string().optional(),
    institute: z.string().optional(),
    resumeUrl: z.string().url().optional().or(z.literal(''))
});

// Auth Schemas (Change Password)
exports.changePasswordSchema = z.object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters long" })
});
