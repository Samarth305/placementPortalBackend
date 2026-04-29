require('dotenv').config();

const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET=process.env.JWT_SECRET;

//signup

exports.signup = async(req,res)=>{
    try {
        const{name,email,password,cgpa,institute,dept}=req.body;
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        const user = await prisma.student.create({
            data:{
                name,
                email,
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
        
        const user= await prisma.student.findUnique({
            where:{email},
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

        const token=jwt.sign(
            {
                userId:user.studentId,
                role:"student"
            },JWT_SECRET,
            {expiresIn:"1d"}
        );

        res.json({message:"Login Successful",token});
    } catch (err) {
        res.status(500).json({error:err.message});
    }
};