const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { enqueueCompanyStatusEmail, enqueueAdminLoginEmail } = require('../queues/email.queue');



//login
exports.adminLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const emailLower = email.toLowerCase();
        //check if that admin is present
        const admin = await prisma.admin.findUnique({
            where:{
                email: emailLower
            }
        });
        //if not present
        if(!admin){
            return res.status(404).json({
                error:"no such admin found"
            });
        }
        //check if password matches
        const matching = await bcrypt.compare(password,admin.password);
        //if does not match
        if(!matching){
            return res.status(400).json({
                error:"incorrect password"
            });
        }
        //if matches
        //create a session
        const token = jwt.sign(
            {
                adminId:admin.adminId,
                role:"admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1D"
            }
        );

        enqueueAdminLoginEmail(admin.email, admin.name).catch(console.error);


        res.json({
            message:"admin successfully loged in",token, role : "admin"
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

//signup
exports.adminSignUp = async (req,res) => {
    try {

        const {name , email , password} = req.body;
        const emailLower = email.toLowerCase();

        //check if the email already exists
        const emailExists = await prisma.admin.findUnique({
            where:{
                email: emailLower
            }
        });

        if(emailExists){
            return res.status(400).json({
                error: "admin already exists"
            });
        }

        //does not exist
        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);
        //insert in the database
        const admin = await prisma.admin.create({
            data:{
                name,
                email:emailLower,
                password:hashedPassword
            }
        });

        res.json({
            message:"admin succesfully registered" , admin
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

//pending companies
exports.getPendingCompanies = async (req,res)=>{
    try {
        const companies = await prisma.company.findMany({
            where:{
                status:"PENDING"
            }
        });

        res.json(companies);

    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

//reject
exports.updateCompanyStatus = async (req,res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        //change the status to rejected
        const changedCompany = await prisma.company.update({
            where:{
                companyId:id
            },
            data:{
                status:status
            }
        });

        enqueueCompanyStatusEmail(changedCompany.email, changedCompany.name, status).catch(console.error);


        res.json({
            message:`company status changed to ${status}`,changedCompany
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

// //approve the company
// exports.approveCompany = async (req,res)=>{
//     try {
//         const {id}=req.params;
//         const changedCompany = await prisma.company.update({
//             where:{
//                 companyId:id
//             },
//             data:{
//                 status:"APPROVED"
//             }
//         });
//         res.json({
//             message:"approved the company" , changedCompany
//         });
//     } catch (err) {
//         return res.status(500).json({
//             error:err.message
//         });
//     }
// };

//filter the company
exports.getAllCompanies = async (req,res) => {
    try {
        const {status,search} = req.query;
        const where = {};

        //filter by status
        if(status){
            where.status = status;
        }

        //filter by name
        if(search){
            where.name = {
                contains:search.toString(),
                mode:"insensitive"
            };
        }

        //get the companies
        const companies = await prisma.company.findMany({
            where,
            orderBy:{
                createdAt:'desc'
            },
            select:{
                companyId:true,
                name:true,
                email:true,
                location:true,
                status:true,
                createdAt:true
            }
        });

        res.json({
            totalCompanies:(await companies).length,
            companies
        });
    } catch (err) {
        return res.status(500).json({
            error : err.message
        });
    }
};

//get the admin stats
exports.getAdminStats = async (req,res) => {
    try {
        const totalStudents = await prisma.student.count();
        const totalCompanies = await prisma.company.count();
        const pendingCompanies = await prisma.company.count({
            where:{
                status:"PENDING"
            }
        });
        const approvedCompanies = await prisma.company.count({
            where:{
                status:"APPROVED"
            }
        });
        const totalJobs = await prisma.job.count();
        const totalApplications = await prisma.application.count();

        // Chart data for student signups over the last 6 months
        const students = await prisma.student.findMany({ select: { createdAt: true } });
        const chartData = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = monthNames[d.getMonth()];
            const year = d.getFullYear();
            const monthIndex = d.getMonth();
            
            const count = students.filter(s => {
                const sDate = new Date(s.createdAt);
                return sDate.getMonth() === monthIndex && sDate.getFullYear() === year;
            }).length;
            
            chartData.push({ m, v: count });
        }

        res.json({
            totalStudents,
            totalCompanies,
            pendingCompanies,
            approvedCompanies,
            totalJobs,
            totalApplications,
            chartData
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};