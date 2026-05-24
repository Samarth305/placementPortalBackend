require('dotenv').config();
const cors = require("cors");
const express = require ('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app=new express();
app.use(cors());
app.use(express.json());

const {apiLimiter} = require('./middleware/rateLimiter.middleware');
app.use(helmet());
app.use(morgan('dev'));

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const jobRoutes=require('./routes/job.routes');
const companyRoutes=require('./routes/company.routes');
const adminRoutes=require('./routes/admin.routes');
const notificationRoutes = require('./routes/notif.routes');
require('./workers/email.worker');

const errorHandler = require('./middleware/error.middleware');

app.use('/api', apiLimiter);
app.use('/api/auth',authRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/company',companyRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(errorHandler);

const PORT=5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});