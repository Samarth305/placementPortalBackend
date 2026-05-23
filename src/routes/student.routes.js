const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const validateRequest = require('../middleware/validateRequest');
const { updateProfileSchema } = require('../schemas/api.schema');

const {updateProfile , getMyApplications , getStudentDashboard, uploadResume, getProfile} = require('../controllers/student.controller');

router.patch('/editProfile',authMiddleware,roleMiddleware('student'), validateRequest(updateProfileSchema), updateProfile);
router.get('/applications',authMiddleware,roleMiddleware('student'),getMyApplications);
router.get('/dashboard',authMiddleware,roleMiddleware('student'),getStudentDashboard);
router.post("/upload-resume",authMiddleware,roleMiddleware("student"),upload.single("resume"),uploadResume);
router.get("/profile",authMiddleware,roleMiddleware("student"),getProfile);
module.exports = router ;