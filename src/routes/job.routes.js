const express=require('express');
const router=express.Router();

const {getJobs , applyJob , getMyApplications} = require('../controllers/job.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/apply',authMiddleware,applyJob);
router.get('/',getJobs);
router.get('/my-applications',authMiddleware,getMyApplications);

module.exports = router;