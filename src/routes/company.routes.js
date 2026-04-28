const express=require('express');
const router=express.Router();

const {companySignUp , companyLogin} = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/login',companyLogin);
router.post('/signup',companySignUp);

module.exports = router;