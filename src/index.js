require('dotenv').config();

const express = require ('express');
const app=new express();

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const jobRoutes=require('./routes/job.routes');
const companyRoutes=require('./routes/company.routes');
const adminRoutes=require('./routes/admin.routes');

app.use('/api/auth',authRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/company',companyRoutes);
app.use('/api/admin',adminRoutes);

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});