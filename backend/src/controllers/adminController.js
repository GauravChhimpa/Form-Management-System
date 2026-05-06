const Professor = require('../models/Professor');

// Get all pending professors
const getPendingProfessors = async (req, res) => {
  try {
    const professors = await Professor.find({ isApproved: false, role: 'professor' })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.json({ success: true, professors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all approved professors
const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find({ role: 'professor' })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.json({ success: true, professors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve a professor
const approveProfessor = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id).populate('department', 'name code');

    if (!professor) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    if (professor.isApproved) {
      return res.status(400).json({ success: false, message: 'Professor is already approved' });
    }

    professor.isApproved = true;
    await professor.save();

    res.json({ success: true, message: `${professor.name} has been approved successfully`, professor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reject and delete a professor
const rejectProfessor = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    await professor.deleteOne();
    res.json({ success: true, message: 'Professor rejected and removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Revoke approval of a professor
const revokeProfessor = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    professor.isApproved = false;
    await professor.save();

    res.json({ success: true, message: `${professor.name}'s access has been revoked` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPendingProfessors, getAllProfessors, approveProfessor, rejectProfessor, revokeProfessor };