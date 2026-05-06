const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Form title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  googleFormUrl: {
    type: String,
    required: [true, 'Google Form URL is required'],
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'Professor is required']
  },
  deadline: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update the updatedAt field on every save
formSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Form', formSchema);