const express = require('express');
const router = express.Router();

const {adminLogin , adminSignUp , getPendingCompanies , approveCompany , rejectCompany , getAllCompanies , getAdminStats} = require('../controllers/admin.controller');

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.post('/login',adminLogin);
router.get('/companies/pending',authMiddleware,roleMiddleware('admin'),getPendingCompanies);
router.patch('/companies/:id/approve',authMiddleware,roleMiddleware('admin'),approveCompany);
router.patch('/companies/:id/reject',authMiddleware,roleMiddleware('admin'),rejectCompany);
router.get('/companies',authMiddleware,roleMiddleware('admin'),getAllCompanies);
router.get('/stats',authMiddleware,roleMiddleware('admin'),getAdminStats);
router.post('/signup',adminSignUp);

module.exports = router;