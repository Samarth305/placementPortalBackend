const prisma = require("../lib/prisma");

//get the notifications for logged in user
exports.getNotificationForUser = async (req,res) => {
    try {
        
        const whereClause = {};

        //know the role of the user
        if(req.user.role==="student"){
            whereClause.studentId = req.user.userId;
        }
        else if(req.user.role==="company"){
            whereClause.companyId=req.user.companyId;
        }
        else if(req.user.role==="admin"){
            whereClause.adminId = req.user.adminId;
        }
        
        const notifForThatUser = await prisma.notification.findMany({
            where:whereClause,
            orderBy:{
                createdAt:"desc"
            },
            take:20
        });

        res.json({
            notifForThatUser
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

//mark a single notification as read
exports.markSingleNotifAsRead = async (req,res) => {
    try {
        const {notificationId} = req.params;
        const notification = await prisma.notification.update({
            where:{
                notificationId
            },
            data:{
                isRead:true
            }
        });

        res.json({
            message:"UPDATED",notification
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};

//mark all as read
exports.markAllAsRead = async (req,res) => {
    try {
        const whereClause = {};

        if(req.user.role === "student"){
            whereClause.studentId = req.user.userId;
        }
        else if(req.user.role === "company"){
            whereClause.companyId = req.user.companyId;
        }
        else if(req.user.role === "admin"){
            whereClause.adminId = req.user.adminId;
        }

        const result = await prisma.notification.updateMany({
            where:whereClause,
            data:{
                isRead:true
            }
        });
        res.json({
            message:"marked all notifications as read"
        });
    } catch (err) {
        return res.status(500).json({
            error:err.message
        });
    }
};