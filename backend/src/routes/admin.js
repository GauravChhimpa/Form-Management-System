const express = require('express');
const router = express.Router();
const {
  getPendingProfessors,
  getAllProfessors,
  approveProfessor,
  rejectProfessor,
  revokeProfessor
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/auth');

// All admin routes are protected and admin only
router.get('/professors/pending', protect, adminOnly, getPendingProfessors);
router.get('/professors', protect, adminOnly, getAllProfessors);
router.put('/professors/:id/approve', protect, adminOnly, approveProfessor);
router.delete('/professors/:id/reject', protect, adminOnly, rejectProfessor);
router.put('/professors/:id/revoke', protect, adminOnly, revokeProfessor);

module.exports = router;