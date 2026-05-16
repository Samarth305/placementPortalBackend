const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

const {updateProfile , getMyApplications , getStudentDashboard, uploadResume} = require('../controllers/student.controller');

router.patch('/profile',authMiddleware,roleMiddleware('student'),updateProfile);
router.get('/applications',authMiddleware,roleMiddleware('student'),getMyApplications);
router.get('/dashboard',authMiddleware,roleMiddleware('student'),getStudentDashboard);
router.post("/upload-resume",authMiddleware,roleMiddleware("student"),upload.single("resume"),uploadResume)

module.exports = router ;