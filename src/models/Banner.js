const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  buttonText: { type: String },
  linkUrl: { type: String, default: '/' }
}, { timestamps: true });

module.exports = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
