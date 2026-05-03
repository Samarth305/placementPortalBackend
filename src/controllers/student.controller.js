const prisma = require('../lib/prisma');

//update the profile
exports.updateProfile = async (req,res) => {
    try {
        const studentId = req.user.studentId;
        const{ name , cgpa , dept , institute , resumeUrl } = req.body;
        const student = await prisma.student.update({
            where:{
                studentId
            },
            data:{
                name ,
                cgpa : cgpa !== undefined ? parseFloat(cgpa) : undefined,
                dept ,
                institute ,
                resumeUrl
            },
            select:{
                studentId:true,
                name:true,
                email:true,
                cgpa:true,
                dept:true,
                institute:true,
                resumeUrl:true,
            }
        });

        res.json({
            message:"profile updated succesfully"
        });

    } catch (err) {
        return res.status(500).json({
            error : err.message
        });
    }
};

//view all applications
exports.getMyApplications = async (req,res) => {
    try {
        const studentId = req.user.studentId;

        const applications = await prisma.application.findMany({
            where:{
                studentId
            },
            include:{
                job:{
                    include:{
                        company:{
                            select:{
                                name:true,
                                location:true
                            }
                        }
                    }
                }
            },
            orderBy:{
                appliedAt:"desc"
            }
        });

        res.json({
            applications
        });
    } catch (err) {
        return res.status(500).json({
            error : err.message
        });
    }
};

//dashboard
exports.getStudentDashboard = async (req,res) => {
    try {
        const studentId = req.user.studentId;

        const totalApplications = await prisma.application.findMany({
            where:{
                studentId
            }
        });

        const shortlisted = await prisma.application.findMany({
            where:{
                studentId,
                status:"SHORTLISTED"
            }
        });

        const rejected = await prisma.application.findMany({
            where:{
                studentId,
                status:"REJECTED"
            }
        });

        res.json({
            totalApplications,
            shortlisted,
            rejected
        });
    } catch (err) {
        error : err.message;
    }
}