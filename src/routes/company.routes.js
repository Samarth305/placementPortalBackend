const express=require('express');
const router=express.Router();

const {companySignUp , companyLogin , postJob , getApplicants , getMyJobs , editJob , deleteJob , updateApplicantStatus , companyDashboard} = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.post('/login',companyLogin);
router.post('/signup',companySignUp);
router.post('/jobs',authMiddleware,roleMiddleware('company'),postJob);
router.get('/jobs/:jobId/applicants',authMiddleware,roleMiddleware('company'),getApplicants);
router.get('/viewJobs',authMiddleware,roleMiddleware('company'),getMyJobs);
router.patch('/jobs/:jobId',authMiddleware,roleMiddleware('company'),editJob);
router.patch('/applications/:applicationId/status',authMiddleware,roleMiddleware('company'),updateApplicantStatus);
router.get('/dashboard', authMiddleware, roleMiddleware('company'), companyDashboard);
// router.delete('/jobs/:jobId',authMiddleware,roleMiddleware('company'),deleteJob);

module.exports = router;