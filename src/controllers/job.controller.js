const prisma = require('../lib/prisma');

//apply for the job
exports.applyJob = async (req,res)=>{
    try{
        const studentId=req.user.userId;
        const {jobId} = req.body;

        //find the job
        const job= await prisma.job.findUnique({
            where:{jobId},
        });

        //not found
        if(!job){
            return res.status(404).json({
                error: "job not found"
            });
        }

        //check for duplicate applications
        const existingApplication = await prisma.application.findUnique({
            where:{
                jobId_studentId:{
                    jobId,
                    studentId,
                },
            },
        });

        //exists
        if(existingApplication){
            return res.status(400).json({
                error:"you have already applied to this"
            });
        }

        //does not exist
        //create one application
        const createApplication = await prisma.application.create({
            data:{
                jobId,
                studentId,
            },
        });

        res.json({
            message: "Successfully Applied",
            createApplication
        });
    }
    catch(err){
        res.status(500).json({
            error: err.message
        });
    }
};

//get the list of jobs
exports.getJobs = async (req,res)=>{
    try {
        let {
            page = 1,
            limit = 10 ,
            location , 
            minCtc ,
            search
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page-1)*limit;

        const where = {};
        
        //location filter
        if(location){
            where.company={
                location:{
                    contains : location,
                    mode : "insensitive"
                }
            };
        }

        //min ctc
        if(minCtc){
            where.ctc={
                gte:parseFloat(minCtc)
            };
        }

        //role
        if(search){
            where.role = {
                contains : search ,
                mode : "insensitive"
            };
        }

        const jobs = await prisma.job.findMany({
            where,
            skip,
            take:limit,

            include:{
                company:{
                    select:{
                        name:true,
                        location:true
                    }
                },

                _count:{
                    select:{
                        applications:true
                    }
                }
            },

            orderBy:{
                createdAt:"desc"
            }
        });

        const totalJobs = await prisma.job.count({where});

        res.json({
            page,
            limit,
            totalJobs,
            totalPages:Math.ceil(totalJobs/limit),
            jobs
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

//get the list of applications
exports.getMyApplications = async (req,res)=>{
    try {
        const studentId=req.user.userId;
        const applications = await prisma.application.findMany({
            where:{
                studentId
            },
            include:{
                job:{
                    include:
                    {
                        company:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            },
            orderBy:{
                appliedAt:'desc'
            }
        });
        res.json(applications);
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};