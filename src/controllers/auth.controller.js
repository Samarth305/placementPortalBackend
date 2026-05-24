require('dotenv').config();
const { generateAccessToken, generateRefreshToken } = require('../utils/token.utils');

const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET=process.env.JWT_SECRET;

//signup
exports.signup = async(req,res)=>{
    try {
        const{name,email,password,cgpa,institute,dept}=req.body;
        
        const emailLower = email.toLowerCase();
        
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        const user = await prisma.student.create({
            data:{
                name,
                email:emailLower,
                password: hashedPassword,
                cgpa,
                institute,
                dept,
            },
        });

        res.json({message:"signup successful",user});
    } catch (err) {
        res.status(500).json({
            error:err.message
        });
    }
};

//login
exports.login = async (req,res) =>{
    try {
        const{email,password}=req.body;
        const emailLower = email.toLowerCase();
        
        const user= await prisma.student.findUnique({
            where:{email:emailLower},
        });

        if(!user){
            return res.status(400).json({
                error:"User Not Found"
            });
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                error:"invalid password"
            })
        }

        const payload = { userId: user.studentId, role: "student" };
        
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        // Save the refresh token to the database securely
        await prisma.student.update({
            where: { studentId: user.studentId },
            data: { refreshToken }
        });

        res.json({message:"Login Successful",accessToken,refreshToken,role:"student"});
    } catch (err) {
        res.status(500).json({error:err.message});
    }
};

//change password
exports.changePassword = async(req,res) => {
    try {
        // console.log(req.user);
        // console.log(req.body);
        const {oldPassword , newPassword} = req.body;
        const user = req.user;

        let extinguisher;

        if(user.role==='student'){
            extinguisher = await prisma.student.findUnique({
                where:{
                    studentId : user.userId
                }
            });
        }

        if(user.role==='company'){
            extinguisher = await prisma.company.findUnique({
                where:{
                    companyId:user.companyId
                }
            });
        }

        if(user.role==='admin'){
            extinguisher = await prisma.admin.findUnique({
                where:{
                    adminId:user.adminId
                }
            });
        }

        //no such user found
        if(!extinguisher){
            return res.status(404).json({
                message:"User Not Found"
            });
        }

        //check if the oldpassword is same as the current password
        const compare = await bcrypt.compare(oldPassword,extinguisher.password);
        if(!compare){
            return res.status(400).json({
                error:"Incorrect Old Password"
            });
        }

        //update the current password with new password
        const newHashedPassword = await bcrypt.hash(newPassword,10);

        if (user.role === "student") {
            await prisma.student.update({
                where: { studentId: user.userId },
                data: { password: newHashedPassword },
            });
        }

        if (user.role === "company") {
            await prisma.company.update({
                where: { companyId: user.companyId },
                data: { password: newHashedPassword },
            });
        }

        if (user.role === "admin") {
            await prisma.admin.update({
                where: { adminId: user.adminId },
                data: { password: newHashedPassword },
            });
        }

        res.json({
            message: "Password changed successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });

        // Verify the token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        let user;
        if (decoded.role === 'student') user = await prisma.student.findUnique({ where: { studentId: decoded.userId } });
        if (decoded.role === 'company') user = await prisma.company.findUnique({ where: { companyId: decoded.companyId } }); 
        if (decoded.role === 'admin') user = await prisma.admin.findUnique({ where: { adminId: decoded.adminId } }); 

        // Check if user exists AND if the token matches the one in their database record
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Strip old expiry data and issue a fresh 15-minute Access Token
        const newPayload = { ...decoded };
        delete newPayload.iat;
        delete newPayload.exp;
        
        const newAccessToken = generateAccessToken(newPayload);
        res.json({ token: newAccessToken });

    } catch (err) {
        res.status(403).json({ error: "Refresh token expired or invalid" });
    }
};
