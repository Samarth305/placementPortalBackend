require('dotenv').config();

const express = require ('express');

const authRoutes = require('./routes/auth.routes');
const jobRoutes=require('./routes/job.routes');

const app=new express();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/jobs',jobRoutes);

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});