//server/models/Like.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemType: { type: String, required: true } // e.g., 'post', 'startup', 'article'
}, { timestamps: true });

module.exports = mongoose.model('Like', likeSchema);
