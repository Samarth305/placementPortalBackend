const express = require("express");
const router = express.Router();

const {signup,login,changePassword} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
router.post('/signup',signup);
router.post('/login',login);
router.patch('/change-password',authMiddleware,changePassword);

module.exports = router;