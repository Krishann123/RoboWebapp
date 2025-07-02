const mongoose = require('mongoose');

const TourGallerySchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TourGallery', TourGallerySchema); 