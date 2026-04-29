const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//login
exports.adminLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        //check if that admin is present
        const admin = await prisma.admin.findUnique({
            where:{
                email
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

        res.json({
            message:"admin successfully loged in",token
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
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
exports.rejectCompany = async (req,res)=>{
    try {
        const {id} = req.params;

        //change the status to rejected
        const changedCompany = await prisma.company.update({
            where:{
                companyId:id
            },
            data:{
                status:"REJECTED"
            }
        });

        res.json({
            message:"company status changed to rejected",changedCompany
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

//approve the company
exports.approveCompany = async (req,res)=>{
    try {
        const {id}=req.params;
        const changedCompany = await prisma.company.findMany({
            where:{
                companyId:id
            },
            data:{
                status:"APPROVED"
            }
        });
        res.json({
            message:"approved the company" , changedCompany
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};