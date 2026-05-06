const Department = require('../models/Department');
const Form = require('../models/Form');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, code, description, color, icon } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const department = await Department.create({ name, code, description, color, icon });
    res.status(201).json({ success: true, department });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Department name or code already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    // Check if any forms belong to this department
    const formCount = await Form.countDocuments({ department: req.params.id });
    if (formCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${formCount} form(s) are linked to this department`
      });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllDepartments, createDepartment, updateDepartment, deleteDepartment };