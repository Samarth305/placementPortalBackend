const express = require("express");
const router = express.Router();

const {signup,login,changePassword , refreshToken} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const { loginSchema, studentSignupSchema, companySignupSchema, adminSignupSchema } = require('../schemas/auth.schema');
const { changePasswordSchema } = require('../schemas/api.schema');
const { loginLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/signup',loginLimiter, validateRequest(studentSignupSchema), signup);
router.post('/login', loginLimiter,validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.patch('/change-password',authMiddleware, validateRequest(changePasswordSchema), changePassword);

module.exports = router;