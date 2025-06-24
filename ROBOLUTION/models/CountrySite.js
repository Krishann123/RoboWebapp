const mongoose = require('mongoose');

const CountrySiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  },
  flagUrl: {
    type: String,
    default: ''
  },
  templateName: {
    type: String,
    required: true
  },
  templateIndex: {
    type: Number,
    default: 0
  },
  customStyles: {
    type: Object,
    default: {
      primaryColor: '#00008b',
      secondaryColor: '#FFB366',
      accentColor: '#6AAAFF',
      backgroundColor: '#FFFFFF'
    }
  },
  metaTags: {
    type: Object,
    default: {
      title: '',
      description: '',
      keywords: ''
    }
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

// Pre-save middleware to automatically generate slug if not provided
CountrySiteSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CountrySite', CountrySiteSchema); 