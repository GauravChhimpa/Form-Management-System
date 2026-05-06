const express = require('express');
const router = express.Router();
const {
  getAllForms,
  getMyForms,
  getFormStats,
  getSingleForm,
  createForm,
  updateForm,
  deleteForm
} = require('../controllers/formController');
const { protect } = require('../middlewares/auth');

router.get('/', getAllForms);                      // public
router.get('/my', protect, getMyForms);            // professors only
router.get('/stats', protect, getFormStats);       // professors only
router.get('/:id', getSingleForm);                 // public
router.post('/', protect, createForm);             // professors only
router.put('/:id', protect, updateForm);           // owner or admin
router.delete('/:id', protect, deleteForm);        // owner or admin

module.exports = router;