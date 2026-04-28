const express = require('express');
const router = express.Router();

const {adminLogin , getPendingCompanies , approveCompany , rejectCompany} = require('../controllers/admin.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.post('/login',adminLogin);
router.get('/companies/pending',getPendingCompanies);
router.patch('/companies/:id/approve',approveCompany);
router.patch('/companies/:id/reject',rejectCompany);

module.exports = router;