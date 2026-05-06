const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Professor = require('../models/Professor');
const Department = require('../models/Department');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({ success: false, message: 'Invalid department' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const professor = await Professor.create({
      name,
      email,
      password: hashedPassword,
      department,
      isApproved: false  // always false on register
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please wait for admin approval before logging in.',
      professor: {
        id: professor._id,
        name: professor.name,
        email: professor.email,
        department: dept,
        role: professor.role,
        isApproved: professor.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const professor = await Professor.findOne({ email }).select('+password').populate('department');
    if (!professor) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, professor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if professor is approved by admin
    if (!professor.isApproved) {
      return res.status(403).json({ success: false, message: 'Your account is pending admin approval. Please wait.' });
    }

    const token = generateToken(professor._id);

    res.json({
      success: true,
      token,
      professor: {
        id: professor._id,
        name: professor.name,
        email: professor.email,
        department: professor.department,
        role: professor.role,
        isApproved: professor.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      professor: {
        id: req.professor._id,
        name: req.professor.name,
        email: req.professor.email,
        department: req.professor.department,
        role: req.professor.role,
        isApproved: req.professor.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };