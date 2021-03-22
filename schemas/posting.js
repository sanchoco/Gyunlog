const mongoose = require('mongoose');
const { Schema } = mongoose;

const posting = new Schema({
	postId: { type: Number, required: true, unique: true },
	title: { type: String},
	writer: { type: String, required: true, },
	content: { type: String, required: true },
	password: { type: String, required: true },
	date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Post", posting);
