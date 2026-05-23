const {Worker, tryCatch} = require('bullmq');
const { sendAdminLoginAlert, sendCompanyStatusEmail } = require('../lib/email.service');

const connection = {
    host : "localhost",
    port:6379
};

const emailWorker = new Worker('email-queue',async (job) =>{
    console.log(`[Worker] Processing Job ${job.id} of type ${job.name}...`);

    try {
        if(job.name==='admin-login'){
            const {adminEmail , adminName} = job.data;
            await sendAdminLoginAlert(adminEmail , adminName);
            console.log(`[Worker] Admin login alert sent to ${adminName}`);
        }else if (job.name === "company-status"){
            const {companyEmail , companyName , status} = job.data;
            await sendCompanyStatusEmail(companyEmail , companyName , status);
            console.log(`[Worker] Company status email sent to ${companyName}`);
        }
    } catch (err) {
        console.error(`[Worker] Job ${job.id} failed:`, err);
        throw err;
    }
},{connection});

//handle global worker events
emailWorker.on('failed',(job,err)=>{
    console.error(`[Worker] Job ${job?.id} failed`)
});

console.log("BullMQ Email Worker initialized and listening to Redis...");