const mongoose = require('mongoose');
const { Schema } = mongoose;

const comment = new Schema({
	commentId: { type: Number, required: true, unique: true },
	postId: { type: Number, required: true },
	nickname: { type: String, required: true },
	comment: { type: String, required: true },
	date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Comment', comment);
