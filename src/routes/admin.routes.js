const express = require('express');
const router = express.Router();

const {adminLogin , adminSignUp , getPendingCompanies , updateCompanyStatus , getAllCompanies , getAdminStats ,exportStudents} = require('../controllers/admin.controller');

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validateRequest');
const { loginSchema, adminSignupSchema } = require('../schemas/auth.schema');
const { updateCompanyStatusSchema } = require('../schemas/api.schema');
const { loginLimiter } = require('../middleware/rateLimiter.middleware');


router.post('/login',loginLimiter, validateRequest(loginSchema), adminLogin);
router.get('/companies/pending',authMiddleware,roleMiddleware('admin'),getPendingCompanies);
router.patch('/companies/:id/updateCompanyStatus',authMiddleware,roleMiddleware('admin'), validateRequest(updateCompanyStatusSchema), updateCompanyStatus);
router.get('/companies',authMiddleware,roleMiddleware('admin'),getAllCompanies);
router.get('/stats',authMiddleware,roleMiddleware('admin'),getAdminStats);
router.post('/signup',loginLimiter, validateRequest(adminSignupSchema), adminSignUp);
router.get('/export/students', authMiddleware, roleMiddleware("admin"), exportStudents);


module.exports = router;