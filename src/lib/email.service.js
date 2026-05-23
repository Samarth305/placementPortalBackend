const nodemailer = require ("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

//send the company status updation mail
exports.sendCompanyStatusEmail = async (companyEmail , companyName , status ) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: companyEmail,
            subject: `PlaceHub: Your Company Account is ${status}`,
            html: `
                <h3>Hello ${companyName},</h3>
                <p>Your company profile status has been updated to: <strong>${status}</strong> by the administrator.</p>
                ${status === 'APPROVED' ? '<p>You can now log in to the portal and start posting jobs!</p>' : ''}
                <br/>
                <p>Regards,<br/>The PlaceHub Team</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Status email sent to ${companyEmail}`);
    } catch (err) {
        console.log("error sending company email : " , err);
    }
}

//send email to admin on login
exports.sendAdminLoginAlert = async (adminEmail , adminName) => {
    try {
        const mailOptions ={
            from :process.env.EMAIL_USER,
            to:adminEmail,
            subject: `Security Alert: New Admin Login`,
            html: `
                <h3>Hello ${adminName},</h3>
                <p>We detected a successful login to your PlaceHub Admin account just now.</p>
                <p>If this was you, you can safely ignore this email.</p>
                <br/>
                <p>Regards,<br/>The PlaceHub Team</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Admin login alert sent to ${adminEmail}`);
    } catch (err) {
        console.log("error sending admin email",err)
    }
}