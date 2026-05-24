const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token.utils');

//signup
exports.companySignUp = async (req, res) => {
    try {
        const { name, email, password, location, description } = req.body;

        const emailLower = email.toLowerCase();

        //check if already existing
        const existing = await prisma.company.findUnique({
            where: {
                email:emailLower
            }
        });

        if (existing) {
            return res.status(400).json({
                error: "company already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const company = await prisma.company.create({
            data: {
                name,
                email:emailLower,
                password: hashedPassword,
                location,
                description
            }
        });

        res.json({
            message: "company signup successful , wait for admin approval", company
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

//login
exports.companyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailLower = email.toLowerCase();

        //check if company exists
        const company = await prisma.company.findUnique({
            where: {
                email:emailLower
            }
        });

        //not found
        if (!company) {
            return res.status(404).json({
                message: "company not found"
            });
        }

        //found
        //check for password
        const match = await bcrypt.compare(password, company.password);

        //not matched
        if (!match) {
            return res.status(400).json({
                message: "incorrect password"
            });
        }

        //matched
        //company not approved
        if (company.status == 'PENDING') {
            return res.status(403).json({
                error: "company pending for approval"
            });
        }

        //company approved
        const payload = { companyId: company.companyId, role: "company" };
        
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await prisma.company.update({
            where: { companyId: company.companyId },
            data: { refreshToken }
        });

        res.json({
            message: "company logged in", accessToken, refreshToken, role: "company"
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//post job opening
exports.postJob = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { role, jdUrl, ctc, deadline } = req.body;

        const company = await prisma.company.findUnique({
            where: {
                companyId
            }
        });

        if (!company) {
            return res.status(404).json({
                error: "company not foundd"
            });
        }

        if (company.status != "APPROVED") {
            return res.status(403).json({
                error: "company not approved to post the job"
            });
        }

        const job = await prisma.job.create({
            data: {
                role,
                jdUrl,
                ctc,
                deadline: new Date(deadline),
                companyId
            }
        });

        res.json({
            message: "job added successfully", job
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//get the applicants list
exports.getApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.user.companyId;

        //check if job exists
        const job = await prisma.job.findUnique({
            where: {
                jobId
            }
        });

        if (!job) {
            return res.status(404).json({
                error: "job not found"
            });
        }

        //does this job belong to the company accessing it ?
        if (job.companyId !== companyId) {
            return res.status(403).json({
                error: "Access Denied"
            });
        }

        //has access , now get the list of applicants
        const applicants = await prisma.application.findMany({
            where: {
                jobId
            },
            include: {
                student: {
                    select: {
                        studentId: true,
                        name: true,
                        email: true,
                        cgpa: true,
                        dept: true,
                        institute: true,
                        resumeUrl: true
                    }
                },
                job:{
                    select:{
                        role:true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({
            jobId,
            totalApplicants: applicants.length,
            applicants
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//get the jobs list
exports.getMyJobs = async (req, res) => {
    try {
        //get the company id
        const companyId = req.user.companyId;

        //get the jobs
        const jobList = await prisma.job.findMany({
            where: {
                companyId
            },
            include: {
                _count: {
                    select: {
                        applications: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({
            totalJobs: jobList.length,
            jobList
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//edit the job
exports.editJob = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { jobId } = req.params;

        //find the job
        const { role, jobUrl, ctc, deadline } = req.body;
        const job = await prisma.job.findUnique({
            where: {
                jobId
            }
        });

        //job not found
        if (!job) {
            return res.status(404).json({
                error: "Job Not Found"
            });
        }

        //does the job belong to requesting company ?
        if (job.companyId !== companyId) {
            return res.status(404).json({
                error: "Access Denied"
            });
        }

        //update that job
        const updatedJob = await prisma.job.update({
            where: {
                jobId
            },
            data: {
                role,
                jdUrl,
                ctc,
                deadline: deadline ? new Date(deadline) : undefined
            }
        });

        res.json({
            message: "Job Updated Succesfully",
            updatedJob
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//delete the job
exports.deleteJob = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { jobId } = req.params;

        //find the job
        const job = await prisma.job.findUnique({
            where: {
                jobId
            }
        });

        //job not found
        if (!job) {
            return res.status(404).json({
                error: "Job Not Found"
            });
        }

        //does the job belong to requesting company ?
        if (job.companyId !== companyId) {
            return res.status(404).json({
                error: "Access Denied"
            });
        }

        //delete the job
        await prisma.job.delete({
            where: {
                jobId
            }
        });

        res.json({
            message: "Job Deleted Succesfully"
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

//update the applicant's status
exports.updateApplicantStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        //update the application status
        const updateApplication = await prisma.application.update({
            where:{
                applicationId
            },
            data:{
                status
            },
            include:{
                job:{
                    select:{
                        role:true,
                        company:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        });

        await prisma.notification.create({
            data:{
                title: "Application Update",
                message: `Your application for ${updateApplication.job.role} at ${updateApplication.job.company.name} was moved to ${status}.`,
                studentId: updateApplication.studentId
            }
        })

        return res.json({
            message:"status updated succesfully" , updateApplication
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//get comapny dashboard
exports.companyDashboard = async (req , res)=>{
    try {
    const companyId = req.user.companyId;
    const openJobsCount = await prisma.job.count({
        where: { companyId }
    });
    const totalApplicantsCount = await prisma.application.count({
        where: { job: { companyId } }
    });
    const shortlistedCount = await prisma.application.count({
            where: { 
            job: { companyId },
            status: "SHORTLISTED"
        }
    });
    const recentApplicants = await prisma.application.findMany({
        where: { job: { companyId } },
        include: {
            student: {
                select: { name: true, email: true, cgpa: true, institute: true }
            },
            job: {
                select: { role: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    res.json({
        openJobs: openJobsCount,
        totalApplicants: totalApplicantsCount,
        shortlisted: shortlistedCount,
        recentApplicants
    });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
}