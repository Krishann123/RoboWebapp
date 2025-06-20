const mongoose = require('mongoose');

const yearVideoSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
yearVideoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('YearVideo', yearVideoSchema); 