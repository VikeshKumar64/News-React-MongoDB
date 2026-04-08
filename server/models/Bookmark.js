const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
