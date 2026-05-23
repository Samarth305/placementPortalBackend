const express = require("express");
const router = express.Router();

const {signup,login,changePassword} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const { loginSchema, studentSignupSchema, companySignupSchema, adminSignupSchema } = require('../schemas/auth.schema');
router.post('/signup', validateRequest(studentSignupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.patch('/change-password',authMiddleware,changePassword);

module.exports = router;