const {Queue} = require("bullmq");

const connection = {
    host : 'localhost',
    port:6379
};

const emailqueue = new Queue('email-queue',{connection});

exports.enqueueAdminLoginEmail = async (adminEmail,adminName) => {
    await emailqueue.add('admin-login',{adminEmail,adminName});
};

exports.enqueueCompanyStatusEmail = async (companyEmail , companyName , status ) => {
    await emailqueue.add('company-status',{companyEmail,companyName,status});
}