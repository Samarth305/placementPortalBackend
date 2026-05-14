require('dotenv').config();
// console.log("ENV:", process.env.DATABASE_URL);
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
// const adapter=new PrismaPg({
//     connectionString: process.env.DATABASE_URL,
// });
const prisma = new PrismaClient;

async function main(params) {
    const company = await prisma.company.create({
        data:{
            name : "Google",
            location: "Bangalore",
            email: "google@test.com",
            description: "Tech company",
            password: "hashedpassword123",
        }
    });
    console.log("company created : ", company);

    const job1 = await prisma.job.create({
        data:{
            role: "SDE Intern",
            jdUrl: "https://example.com/google_sde_intern.pdf",
            ctc: 300000,
            deadline: new Date("2026-06-01"),
            companyId: company.companyId,
        }
    });
    console.log("job created : ", job1);

    const job2 = await prisma.job.create({
        data:{
            role: "SDE Full Time",
            jdUrl: "https://example.com/google_sde_fulltime.pdf",
            ctc: 2000000,
            deadline: new Date("2026-06-10"),
            companyId: company.companyId,
        }
    });
    console.log("company created : ", company);

    const student = await prisma.student.create({
            data: {
            name: "Samarth",
            email: "samarth@example.com",
            cgpa: 8.5,
            password: "hashedpassword123",
            institute: "Your College",
            dept: "CSE",
            resumeUrl: "https://example.com/resume.pdf",
            },
    });

    console.log("Student created:", student);

    // Create application
    const application = await prisma.application.create({
            data: {
            studentId: student.studentId,
            jobId: job1.jobId,
            },
    });

    console.log("Application created:", application);
}

main()
    .catch((e)=>{
        console.error(e)
        process.exit(1);
    })
    .finally(async()=>{
        await prisma.$disconnect();
    });