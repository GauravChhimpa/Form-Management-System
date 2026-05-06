const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect } = require('../middlewares/auth');

router.get('/', getAllDepartments);           // public
router.post('/', createDepartment); // professors only
router.put('/:id', protect, updateDepartment);    // professors only
router.delete('/:id', protect, deleteDepartment); // professors only

module.exports = router;