const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  imageUrl: { type: String },
  subcategories: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
