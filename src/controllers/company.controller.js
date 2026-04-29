const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//signup
exports.companySignUp = async (req,res)=>{
    try {
        const {name,email,password,location,description} = req.body;
        
        //check if already existing
        const existing= await prisma.company.findUnique({
            where:{
                email
            }
        });

        if(existing){
            return res.status(400).json({
                error:"company already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const company = await prisma.company.create({
            data:{
                name,
                email,
                password:hashedPassword,
                location,
                description
            }
        });

        res.json({
            message:"company signup successful , wait for admin approval",company
        });

    } catch (err) {
        res.status(500).json({
            error:err.message
        });
    }
};

//login
exports.companyLogin = async (req,res)=>{
    try {
        const {email,password}=req.body;

        //check if company exists
        const company = await prisma.company.findUnique({
            where:{
                email
            }
        });

        //not found
        if(!company){
            return res.status(404).json({
                message:"company not found"
            });
        }

        //found
        //check for password
        const match = await bcrypt.compare(password,company.password);

        //not matched
        if(!match){
            return res.status(400).json({
                message:"incorrect password"
            });
        }

        //matched
        //company not approved
        if(company.status=='PENDING'){
            return res.status(403).json({
                error:"company pending for approval"
            });
        }

        //company approved
        const token=jwt.sign(
            {
                companyId:company.companyId,
                role:"company"
            },
            process.env.JWT_SECRET,
            {expiresIn:'1D'}
        );

        res.json({
            message: "company logged in" , token
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

//post job opening
exports.postJob = async (req,res) => {
    try {
        const companyId = req.user.companyId;
        const {role , jdUrl , ctc , deadline} = req.body;

        const company = await prisma.company.findUnique({
            where:{
                companyId
            }
        });

        if(company.status!="APPROVED"){
            return res.status(403).json({
                error : "company not approved to post the job"
            });
        }

        const job = await prisma.job.create({
            data:{
                role,
                jdUrl,
                ctc,
                deadline : new Date(deadline),
                companyId
            }
        });

        res.json({
            message: "jbo added successfully" , job
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};