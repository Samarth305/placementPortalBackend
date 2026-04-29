const express=require('express');
const router=express.Router();

const {companySignUp , companyLogin , postJob} = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.post('/login',companyLogin);
router.post('/signup',companySignUp);
router.post('/jobs',authMiddleware,roleMiddleware('company'),postJob);

module.exports = router;