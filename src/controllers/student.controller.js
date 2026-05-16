const prisma = require('../lib/prisma');
const cloudinary = require ("../../config/cloudinary");
const streamifier = require("streamifier");


//update the profile
exports.updateProfile = async (req,res) => {
    try {
        const studentId = req.user.userId;
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
        const studentId = req.user.userId;

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
        const studentId = req.user.userId;

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

//upload the resume
exports.uploadResume = async (req,res) => {
    try {
        const studentid = req.user.userId;
        if(!req.file){
            return res.status(400).json({
                error:"No File Uploaded"
            });
        }
        const streamUpload = () => {
            return new Promise ((resolve,reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder:"resumes",
                        resource_type:"auto"
                    },
                    (error,result)=>{
                        if(result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload();

        const student = await prisma.student.update({
            where:{
                studentId:studentid
            },

            data:{
                resumeUrl:result.secure_url
            }
        });

        res.json({
            message:"Resume Uploadede Successfully",
            resumeUrl:result.secure_url,
            student
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};