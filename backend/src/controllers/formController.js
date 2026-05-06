const Form = require('../models/Form');
const Department = require('../models/Department');

const getAllForms = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { isActive: true };

    if (department) query.department = department;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const forms = await Form.find(query)
      .populate('department', 'name code color icon')
      .populate('professor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ professor: req.professor._id })
      .populate('department', 'name code color icon')
      .populate('professor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFormStats = async (req, res) => {
  try {
    const query = req.professor.role === 'admin' ? {} : { professor: req.professor._id };

    const totalForms = await Form.countDocuments(query);
    const activeForms = await Form.countDocuments({ ...query, isActive: true });
    const totalViewsResult = await Form.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);
    const totalDepartments = await Department.countDocuments();

    res.json({
      success: true,
      stats: {
        totalForms,
        activeForms,
        totalViews: totalViewsResult[0]?.total || 0,
        totalDepartments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSingleForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('department', 'name code color icon')
      .populate('professor', 'name email');

    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    res.json({ success: true, form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createForm = async (req, res) => {
  try {
    const { title, description, googleFormUrl, department, deadline, tags } = req.body;

    if (!title || !googleFormUrl || !department) {
      return res.status(400).json({ success: false, message: 'Title, URL and department are required' });
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({ success: false, message: 'Invalid department' });
    }

    const form = await Form.create({
      title,
      description,
      googleFormUrl,
      department,
      professor: req.professor._id,
      deadline: deadline || null,
      tags: tags || []
    });

    const populated = await Form.findById(form._id)
      .populate('department', 'name code color icon')
      .populate('professor', 'name email');

    res.status(201).json({ success: true, form: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateForm = async (req, res) => {
  try {
    let form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Only the owner or admin can edit
    if (
      form.professor.toString() !== req.professor._id.toString() &&
      req.professor.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this form' });
    }

    form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('department', 'name code color icon')
      .populate('professor', 'name email');

    res.json({ success: true, form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Only the owner or admin can delete
    if (
      form.professor.toString() !== req.professor._id.toString() &&
      req.professor.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this form' });
    }

    await form.deleteOne();
    res.json({ success: true, message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllForms,
  getMyForms,
  getFormStats,
  getSingleForm,
  createForm,
  updateForm,
  deleteForm
};