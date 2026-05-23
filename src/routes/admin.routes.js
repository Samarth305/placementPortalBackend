const express = require('express');
const router = express.Router();

const {adminLogin , adminSignUp , getPendingCompanies , updateCompanyStatus , getAllCompanies , getAdminStats} = require('../controllers/admin.controller');

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validateRequest');
const { loginSchema, adminSignupSchema } = require('../schemas/auth.schema');

router.post('/login', validateRequest(loginSchema), adminLogin);
router.get('/companies/pending',authMiddleware,roleMiddleware('admin'),getPendingCompanies);
router.patch('/companies/:id/updateCompanyStatus',authMiddleware,roleMiddleware('admin'),updateCompanyStatus);
router.get('/companies',authMiddleware,roleMiddleware('admin'),getAllCompanies);
router.get('/stats',authMiddleware,roleMiddleware('admin'),getAdminStats);
router.post('/signup', validateRequest(adminSignupSchema), adminSignUp);

module.exports = router;