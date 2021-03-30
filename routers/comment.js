const express = require("express");
const router = express.Router();
const Post = require('../schemas/posting');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const key = require('../secret_key');
// XSS 방지
const sanitizeHtml = require('sanitize-html');
// 시간 표기 설정
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	comments = await Comment.find({ postId: id }).sort({ "commentId": -1 });
	let user;
	try {
		const { token } = req.headers;
		const { userId } = jwt.verify(token, key);
		user = await User.findOne({ _id: userId },{"nickname":true})
	} catch (err) {	}

	let data = []
	for (i in comments) {
		const commentId = comments[i]["commentId"];
		const postId = comments[i]["postId"];
		const nickname = comments[i]["nickname"];
		const date = moment(comments[i]["date"]).format('MM/DD HH:mm')
		const comment = comments[i]["comment"];
		let permission = 0
		if (user && user["nickname"] == comments[i]["nickname"])
			permission = 1
		data.push({commentId, postId, nickname, date, comment, permission })
	}
	res.json(data);
})

// 새 댓글 작성
router.post('/:id', authMiddleware, async (req, res) => {
	const id = req.params.id;
	const data = await req.body;
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	const user = await User.findOne({ _id: userId },{"nickname":true})
	if (!data.comment) {
		res.json({ msg: "empty" });
		return
	}
	if (!user) {
		res.json({ msg: "fail" })
		return
	}
	let index = 1
	const lasted = await Comment.findOne().sort({ "commentId": -1 });
	if (lasted) {
		index = lasted["commentId"] + 1
	}
	await Comment.create({
		commentId: index,
		comment : sanitizeHtml(data.comment),
		postId: id,
		nickname: user.nickname,
		date: Date.now()
	})
	res.json({ msg: "success" });
})

// 댓글 수정
router.put('/:commentId', authMiddleware, async (req, res) => {
	const commentId = req.params.commentId;
	const data = await req.body;
	if (!data.comment) {
		res.json({ msg: "empty" });
		return
	}
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	try {
		const user = await User.findOne({ _id: userId },{"nickname":true})
		const comment = await Comment.findOne({ commentId }, { "nickname": true })
		if (user.nickname == comment.nickname) {
			await Comment.updateOne({ commentId }, { comment : data.comment })
			res.json({ msg: "success" });
			return
		}
	} catch (err) { }
	res.json({ msg: "fail" });
})

// 댓글 수정
router.delete('/:commentId', authMiddleware, async (req, res) => {
	const commentId = req.params.commentId;
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	try {
		const user = await User.findOne({ _id: userId },{"nickname":true})
		const comment = await Comment.findOne({ commentId }, { "nickname": true })
		if (user.nickname == comment.nickname) {
			await Comment.deleteOne({ commentId })
			res.json({ msg: "success" });
			return
		}
	} catch (err) { }
	res.json({ msg: "fail" });
})


module.exports = router;
